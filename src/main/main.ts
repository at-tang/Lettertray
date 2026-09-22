/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs/promises';
import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Database from 'better-sqlite3';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import type { AutomationRequest, Rule, SavedFlowgraph } from './api/types';
import { Edge } from '@xyflow/react';
import { mainCreateNewRule } from './ipcMainhandleFunctions/rule/createNewRule';
import { generateId } from './ipcMainhandleFunctions/ruleId/generateId';
import { handleNewFileAdded } from './ipcMainhandleFunctions/movingFiles/handleNewFileAdded';
import { FileQueue, MoveFilePayload } from './ipcMainhandleFunctions/movingFiles/FileQueue';
import { openFolderInNative } from './ipcMainhandleFunctions/openExternalWindows/openFolder';
import { submitDirectory } from './ipcMainhandleFunctions/openExternalWindows/submitDirectory';
import { clearFlowgraph } from './ipcMainhandleFunctions/flowgraph/clearFlowgraph';
import { saveFlowgraph } from './ipcMainhandleFunctions/flowgraph/saveFlowgraph';
import { getFlowgraph } from './ipcMainhandleFunctions/flowgraph/getFlowgraph';
import { handleNodeChangeData } from './ipcMainhandleFunctions/flowgraph/handleNodeChangeData';
import { HistoryEntry } from './classes/History';

// For watching folders and automatically filtering
let watcher: { add: (paths: string | string[]) => unknown } | null = null;
let tray: Tray | null = null;
let db: Database.Database | null = null;

// SQL Database for tracking history
function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  db = require('better-sqlite3')(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS history_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin_dir TEXT NOT NULL,
    new_dir TEXT NOT NULL,
    file_name TEXT NOT NULL,
    time INTEGER NOT NULL,
    complete BOOLEAN NOT NULL
    );
    `)
  
}


export const createHistoryEntries =  (entries: HistoryEntry[]) => {
    const stmt = db.prepare('INSERT INTO history_entries (origin_dir, new_dir, file_name, time) VALUES (?, ?, ?, ?)');

    for (const entry of entries) {
        stmt.run(entry.originDir, entry.newDir, entry.fileName, entry.time)
    }
}

export const getHistoryEntries = (limit: number, offset: number) => {
  const stmt = db.prepare('SELECT * FROM history_entries ORDER BY time DESC LIMIT ? OFFSET ?');
  const result = stmt.all(limit, offset)
  return result;
}

ipcMain.handle('get-history-by-page', async (_event, limit: number, offset: number) => {
  return getHistoryEntries(limit, offset);
})

// Modifying Flowgraph :===========================================================

ipcMain.handle('flowgraph-node-change-data', async (_event, oldPath: string, newPath: string) => {
  const result = await handleNodeChangeData(oldPath, newPath);
  if (!result) return false;

  startWatching();
  return true;
})

ipcMain.handle('get-flowgraph', async () => {
  return await getFlowgraph();
})

ipcMain.handle('save-flowgraph', async (_event, flowgraph: SavedFlowgraph) => {
  await saveFlowgraph(flowgraph)
  startWatching();
})

ipcMain.handle('clear-all-rules', async () => {
  await clearFlowgraph();
  startWatching();
})     

ipcMain.handle('generate-id', async () => { // Generate a sequential id
  return await generateId();
})


// Handling Main Window :=======================================================

ipcMain.handle('minimize-app', async () => {
  // Simple minimization of the app. Akin to the yellow traffic button on Mac Systems
  console.log("Attempting to minimize app!")
  mainWindow?.minimize();
})

ipcMain.handle('close-app', async () => {
  // Closes the app. If on Windows/Linux, complete quit. On Mac, simply close the main window but leave
  // application in memory
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      const { default: Store } = await import('electron-store');
      const store = new Store();
      store.set("appOn", false)
      mainWindow?.close();    
    }
})

ipcMain.handle('set-to-background', async () => {

    const { default: Store } = await import('electron-store');
    const store = new Store();
    store.set("appOn", false)
  
  mainWindow?.hide();
  app.dock.hide();
})


// Handling External Windows :=======================================================

ipcMain.handle('open-folder', async (_event, filePath: string) => {
  await openFolderInNative(filePath);
})

ipcMain.handle('dialog:openDirectory', async () => {
  /*
  Opens the OS menu to select a specific directory.
  Returns the absolute path as a string if a directory is selected.
  Returns null if the user cancels the request
  */
  return await submitDirectory();
});

ipcMain.handle('open-external-window', async (_event, url: string) => {
  shell.openExternal(url)
})


// Watching :====================================

// Establishes the fileQueue where files will be queued to see if they need to be moved
// See the ipcMainHandleFunctions/movingFiles/FileQueue.ts for more info
const fileQueue = new FileQueue();


const startWatching = async () => {
  console.log("Beginning watch")
  const [{ default: Store }, { watch }] = await Promise.all([
    import('electron-store'),
    import('chokidar'),
  ]);

  // Store is loaded here, and rules are created from the flowgraph here
  // instead of handleNewFileAdded, mainly for optimization purposes.
  const store = new Store();
  const flowgraph: SavedFlowgraph = await store.get("flowgraph") ?? [];
  const rules: Rule[] = flowgraph.edges.map((edge) => {return edge.data.value}) || [];

  const rulesMap = Map.groupBy(rules, (rule: Rule) => {return rule.originDirectory});
  console.log(rulesMap);

  // Compile a list of all the directories where files will be sorted FROM
  let watchedFolders: string[] = [];
  if (flowgraph.edges.length > 0) {
    watchedFolders = flowgraph.edges.map((edge) => {return edge.data.value.originDirectory})
    
  }

  console.log("Watching these folders: " + watchedFolders);

  // Closes the previous watcher so that a new one with updated data can replace it
  if (watcher) {
    await watcher.close();
  }

  const fileWatcher = watch(watchedFolders, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 1500,
      pollInterval: 100
    },
    depth: 0
  });

  watcher = fileWatcher;

  fileWatcher.on('add', (filePath) => {
    try {
      // Push the detected file onto the queue to see if it needs to be moved
      let selectRules = rulesMap.get(path.dirname(filePath)); 
      let mfp: MoveFilePayload = { filepath: filePath, rules: selectRules} // Each queue object only receives the rules pertaining to the folder being watched
      fileQueue.push(mfp) // Push onto the queue

    } catch (err) {
      console.error("Could not push: " + filePath + " onto the queue.")
    }
  });

    // For directories, the same process applies
    fileWatcher.on('addDir', (filePath) => {
    try {

      // When the move file function checks to see which rules to check,
      // it will only check rules pertaining the original directory, rather than EVERY rule 
      let selectRules = rulesMap.get(path.dirname(filePath));
      let mfp: MoveFilePayload = { filepath: filePath, rules: selectRules}
      fileQueue.push(mfp) // Push onto the queue

    } catch (err) {
      console.error("Could not push Directory: " + filePath + " onto the queue.")

    }
  });
};


// :====================================
const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

const getIconPath = (): string => {
  if (process.platform === "darwin") {
      return getAssetPath("icon.icns")
  } else if (process.platform === 'win32') {
      return getAssetPath("icon.ico")
  } else {
      return getAssetPath("icon.png")
  }
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const createWindow = async () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }


  mainWindow = new BrowserWindow({
    show: false,
    width: 1080,
    height: 600,
    resizable: false,
    frame: false,
    titleBarOverlay: {
      color: '#1d2024'
    },
    icon: getIconPath(),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.setWindowButtonVisibility(false);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.disableHardwareAcceleration();
app.name = "Lettertray";
app
  .whenReady()
  .then(() => {

    initDatabase();

    startWatching().catch(console.error); // Watches files

    

    // App Icon :==============================================================

    const macDockIconPath = getAssetPath("icons/iconRounded.png")
    const icon = nativeImage.createFromPath(macDockIconPath);
    if (process.platform === 'darwin') {
      app.dock.setIcon(icon);
    }

    // Tray :=================================================================

    const trayIconPath = getAssetPath("appIcons/tempAppLogoTray16x16.png");
    const trayIcon = nativeImage.createFromPath(trayIconPath)

    tray = new Tray(trayIcon)

    const contextMenu = Menu.buildFromTemplate([

      // Button to Show / Hide the main window
      {label: "Lettertray"},
      {type: "separator"},
      {label: "Show App", type: "normal", click: async () => {

        const { default: Store } = await import('electron-store');
        const store = new Store();
        store.set("appOn", true)

        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
          return;
        }

        if (!mainWindow.isVisible()) {
          app.show();
          app.dock.show();
          mainWindow.show();
          mainWindow.focus();
        }
        else {
          mainWindow.restore();
          mainWindow.show();
          mainWindow.focus();
        }
      }},

      {label: "Hide Editor", type: "normal", click: async () => {
        const { default: Store } = await import('electron-store');
        const store = new Store();
        store.set("appOn", false) 
        
        app.hide();
        mainWindow?.hide();
        app.dock.hide();
      }},


      {label: "Quit", type: "normal", click: () => {
        app.quit();
      }}

    ])

    tray.setToolTip("Lettertray")
    tray.setContextMenu(contextMenu);




    const openWindowOnLaunch = async () => {
      // Determines if during launch, the main editor should be open or not
      // If it is the user's first login or there are no nodes, then open it
      // Otherwise, only open the tray

        const { default: Store } = await import('electron-store');
        const store = new Store();
        const flowgraph: SavedFlowgraph = store.get("flowgraph")

        if (!store.has("appOn") || flowgraph.nodes.length === 0) {
          store.set("appOn", true)
          mainWindow?.show();
          mainWindow?.focus();          
          createWindow();
        }
        else if (store.get("appOn") === true) {
          mainWindow?.show();
          mainWindow?.focus(); 
          createWindow();
          return;
        }
        else {
          app.dock.hide();
          mainWindow?.hide();
          store.set("appOn", false)
          return;
        }
    }
    openWindowOnLaunch();
    
    //createWindow();
    /*
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    */

  })
  .catch(console.log);



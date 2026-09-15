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
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import type { AutomationRequest, Rule } from './api/types';
import { Edge } from '@xyflow/react';
import { handleFlowgraphEdgeDelete } from './ipcMainhandleFunctions/flowgraph/handleFlowgraphEdgeDelete';
import { handleFlowgraphNodeDelete } from './ipcMainhandleFunctions/flowgraph/handleFlowgraphNodeDelete';

// For watching folders and automatically filtering
let watcher: { add: (paths: string | string[]) => unknown } | null = null;

ipcMain.handle('flowgraph-on-edge-delete', async (_event, edges: Edge[]) => {
  handleFlowgraphEdgeDelete(edges);
})

ipcMain.handle('flowgraph-on-node-delete', async (_event, nodes: Node[]) => {
  handleFlowgraphNodeDelete(nodes);
})

ipcMain.handle('flowgraph-node-change-data', async (_event, oldPath: string, newPath: string) => {
  const { default: Store } = await import('electron-store');
  const store = new Store();
  const rules: Rule[] = await store.get("rules") || [];
  let newRules = [...rules]

  // Check that new folder is not already part of the flowgraph
  // If it is, return false, ending the program early and denying any altercation
  // In the future, there may be an option to SWAP directories
  for (const rule of rules) {
    if (rule.originDirectory === newPath || rule.newDirectory === newPath || oldPath === newPath) {
      return false;
    }

  }

  for (const rule of newRules) {
    if (rule.originDirectory === oldPath) {
      rule.originDirectory = newPath;
    }

    if (rule.newDirectory === oldPath) {
      rule.newDirectory = newPath;
    }
  }

  await store.set("rules", newRules)

  startWatching();

  return true;
 
})

ipcMain.handle('get-flowgraph', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  if (!store.has("flowgraph")) return {nodes: [], edges: []};
  const result = await store.get("flowgraph")
  return result;
})

ipcMain.handle('save-flowgraph', async (_event, flowgraph) => {
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  try {
    store.set("flowgraph", flowgraph);
  } catch (err) {
    console.error(err);
  }
})


ipcMain.handle('get-rules', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  if(!store.has("rules")) return [];

  return store.get("rules");
})


ipcMain.handle('create-new-rule', async (_event, ar: AutomationRequest) => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  const newRule: Rule = {
    title: ar.title,
    type: ar.type,
    originDirectory: ar.originDirectory,
    newDirectory: ar.newDirectory,
    keyword: ar.keyword,
    automationActive: ar.automationActive,
    viewKeyword: ar.viewKeyword
  };

  const arr = (store.get('rules') as typeof newRule[] | undefined) ?? [];
  let newArr = arr.concat([newRule]);
  store.set("rules", newArr);
  watcher?.add(newRule.originDirectory);
})


ipcMain.handle('delete-rule', async (_event, index: number) => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  const rules: Array<Rule> = await store.get("rules") || [];
  if (rules.length < 1) return;
  const newRules = rules.filter((_, i) => i !== index);
  store.set("rules", newRules);
  startWatching();
  return

})


ipcMain.handle('move-file', async () => {
  console.log("Activated!")
  const oldDirectory = '/Users/aidantang/Downloads/TestingForApp/folder1'
  const newDirectory = '/Users/aidantang/Downloads/TestingForApp/folder2' 


  try {
    const dir = await fs.promises.readdir(oldDirectory, { withFileTypes: true });

    for (const file of dir) {
      const oldFilePath = path.join(oldDirectory, file.name)
      const newFilePath = path.join(newDirectory, file.name);
      await fs.promises.rename(oldFilePath, newFilePath);

    }

  } catch (err) {
    console.error(err);
  }

})

ipcMain.handle('clear-all-rules', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  store.delete("rules");
  store.delete("flowgraph");
})


ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0]; // Absolute path string
  }
});

const handleNewFileAdded = async (filePath: string) => { // Automatically activated when watcher becomes active
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const { default: Store } = await import('electron-store');
  const store = new Store();
  const rules: Array<Rule> = await store.get("rules") || [];

  for (const rule of rules) { 
    let fulfilled = false; // Has this file been sorted yet? Only the first rule is applied
    const regexMatch: boolean = RegExp(rule.keyword).test(fileName)
    if (regexMatch && rule.originDirectory === dirPath && !fulfilled) {

      fs.rename(filePath, path.join(rule.newDirectory, fileName), () => {console.log("Successful move of " + filePath + " to " + path.join(rule.newDirectory, fileName))})
      fulfilled = true;
      return

    }

  }

}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Watching :====================================

const startWatching = async () => {
  console.log("Beginning watch")
  const [{ default: Store }, { watch }] = await Promise.all([
    import('electron-store'),
    import('chokidar'),
  ]);
  const store = new Store();
  const rules = (store.get('rules') as Rule[] | undefined) ?? [];
  const watchedFolders = [...new Set(rules.map((rule) => rule.originDirectory))];

  console.log("Watching these folders: " + watchedFolders);

  if (watcher) {
    await watcher.close();
  }

  const fileWatcher = watch(watchedFolders, {
    persistent: true,
    ignoreInitial: false,
  });
  watcher = fileWatcher;

  fileWatcher.on('add', (filePath) => handleNewFileAdded(filePath));
};

// :====================================

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

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    titleBarOverlay: {
      color: '#1d2024'
    },
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

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


// Tray Menu :==================================================
let tray = null;
app
  .whenReady()
  .then(() => {
    startWatching().catch(console.error); // Watches files

    // Tray 
    
    tray = new Tray('assets/icons/24x24.png')
    const contextMenu = Menu.buildFromTemplate([

      {label: "Show / Hide App", type: "normal", click: () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
          return;
        }

        if (mainWindow.isVisible()) {
          mainWindow.hide();
          app.dock.hide();
        } else {
          app.show();
          app.dock.show();
          mainWindow.show();
          mainWindow.focus();
        }
      }},

      {label: "Quit", type: "normal", click: () => {
        app.quit();
      }}

    ])

    tray.setToolTip("Lettertray")
    tray.setContextMenu(contextMenu);

    
    
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    




  })
  .catch(console.log);

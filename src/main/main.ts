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
import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import type { AutomationRequest, Rule, SavedFlowgraph } from './api/types';
import { Edge } from '@xyflow/react';
import { handleFlowgraphEdgeDelete } from './ipcMainhandleFunctions/flowgraph/handleFlowgraphEdgeDelete';
import { handleFlowgraphNodeDelete } from './ipcMainhandleFunctions/flowgraph/handleFlowgraphNodeDelete';
import { mainCreateNewRule } from './ipcMainhandleFunctions/rule/createNewRule';
import { generateId } from './ipcMainhandleFunctions/ruleId/generateId';


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
    await store.set("flowgraph", flowgraph);
  } catch (err) {
    console.error(err);
  }
  startWatching();
})


ipcMain.handle('get-rules', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  if(!store.has("rules")) return [];

  return store.get("rules");
})


ipcMain.handle('create-new-rule', async (_event, r: Rule) => {
  // Add new rule. The function returns the rule added
  const newRule = await mainCreateNewRule(r);

  // Add the originDirectory of the new rule to the list of files being actively watched
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


ipcMain.handle('clear-all-rules', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  store.delete("rules");
  store.delete("flowgraph");
  startWatching();
})


ipcMain.handle('dialog:openDirectory', async () => {
  /*
  Opens the OS menu to select a specific directory.
  Returns the absolute path as a string if a directory is selected.
  Returns null if the user cancels the request
  */

  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0]; // Absolute path string
  }
});

const handleNewFileAdded = async (filePath: string, rules: Rule[]) => { // Automatically activated when watcher becomes active

  // Main function handling the moving of files based on the user's sorting parameters
  // filePath is the current file being addressed

  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);

  /*
  const { default: Store } = await import('electron-store');
  const store = new Store();

  const flowgraph: SavedFlowgraph = await store.get("flowgraph");
  const rules: Rule[] = flowgraph.edges.map((edge) => {return edge.data.value}) || [];
  */


  for (const rule of rules) { 
    // If statements are layered so that if one if doesnt pass, we don't need to process the rest of the ifs
    // Mostly the Regex one
    if (rule.automationActive) {
        if (rule.originDirectory === dirPath) {
          const regexMatch: boolean = RegExp(rule.keyword).test(fileName)
          if (regexMatch) {
            await fs.rename(filePath, path.join(rule.newDirectory, fileName))
            console.log("Successful move of \'" + fileName + "\' to " + rule.newDirectory + " at " + new Date().toLocaleTimeString())
            return
          }
        }
    }

    }

}



ipcMain.handle('generate-id', async () => {
  return await generateId();
})


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Watching :====================================

interface MoveFilePayload {
  filepath: String,
  rules: 

}
let currentRules;


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

  const rulesMap = Map.groupBy(rules, (rule) => {return rule.originDirectory});
  console.log(rulesMap);


  /*
  for (const edge of flowgraph.edges) {
    if (!(rulesMap.has(edge.data.value.originDirectory))) {
      rulesMap.set(edge.data.value.originDirectory, [edge.data.value]);
    } else {
      rulesMap.set(edge.data.value.originDirectory, rulesMap.get(edge.data.value).concat([edge.data.value]))
    }
  }

  for (const key of rulesMap.keys()) {
    console.log(`   ${key}`)
    for (const entry of rulesMap.get(key)) {
      console.log(`       ${entry}`)
    }

  }
  */


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
  });
  watcher = fileWatcher;

  fileWatcher.on('add', (filePath) => {handleNewFileAdded(filePath, rules)});
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
    width: 1080,
    height: 600,
    resizable: false,
    titleBarOverlay: {
      color: '#1d2024'
    },
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
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

      // Button to Show / Hide the main window
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

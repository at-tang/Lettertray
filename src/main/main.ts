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

// For watching folders and automatically filtering
let watcher: { add: (paths: string | string[]) => unknown } | null = null;

ipcMain.handle('get-rules', async () => {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  return store.get("rules") || [];
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
  };

  const arr = (store.get('rules') as typeof newRule[] | undefined) ?? [];
  let newArr = arr.concat([newRule]);
  store.set("rules", newArr);
  watcher?.add(newRule.originDirectory);
})

ipcMain.handle('read-testing-file', () => {
  return fs.readFileSync(
    '/Users/aidantang/Downloads/TestingForApp/untitled.txt',
    'utf8',
  );
});


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
})


ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0]; // This is the absolute path string
  }
});

const handleNewFileAdded = async (filePath: string) => {
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
  const [{ default: Store }, { watch }] = await Promise.all([
    import('electron-store'),
    import('chokidar'),
  ]);
  const store = new Store();
  const rules = (store.get('rules') as Rule[] | undefined) ?? [];
  const watchedFolders = [...new Set(rules.map((rule) => rule.originDirectory))];

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

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
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
        console.log("Quit App button was pressed!")
        if (app.dock.isVisible()) {
           console.log("Hide app")
          mainWindow?.close();
          app.dock.hide();   
          contextMenu.items[0].label = "Show";


        } else {
           console.log("Show app")
          app.show();
          app.dock.show();
          mainWindow?.show();  
          mainWindow?.focus();
          createWindow();
          mainWindow?.setResizable(false);
     
        }
      }},

    ])


    mainWindow?.setResizable(false);
    app.dock.hide();
    //createWindow();
    /*
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    */



    tray.setToolTip("Lettertray")
    tray.setContextMenu(contextMenu);

  })
  .catch(console.log);

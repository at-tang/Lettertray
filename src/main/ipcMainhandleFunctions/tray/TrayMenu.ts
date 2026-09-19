import { BrowserWindow, Menu } from "electron";

export function createTrayMenu(mainWindow: BrowserWindow, app: Electron.App) {
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


      {label: "Quit", type: "normal", click: () => {
        app.quit();
      }}

    ])
    
    return contextMenu;

}
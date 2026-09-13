// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { AutomationRequest } from './api/types';

export type Channels = 'ipc-example';

const electronHandler = {
  readTestingFile() {
    return ipcRenderer.invoke('read-testing-file');
  },
  moveTestingFile() {
    return ipcRenderer.invoke('move-file');
  },

  selectFolder() {
    return ipcRenderer.invoke('dialog:openDirectory')
  },

  createNewRule(ar: AutomationRequest) {
    return ipcRenderer.invoke('create-new-rule', ar)
  },

  getRules() {
    return ipcRenderer.invoke('get-rules')
  },

  clearAllRules() {
    return ipcRenderer.invoke('clear-all-rules')
  },


  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

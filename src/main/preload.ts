// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { AutomationRequest, Rule } from './api/types';
import { Edge } from '@xyflow/react';

export type Channels = 'ipc-example';

const electronHandler = {


  loadFlowgraph() {
    return ipcRenderer.invoke('get-flowgraph')
  },

  saveFlowgraph(flowgraph) {
    return ipcRenderer.invoke('save-flowgraph', flowgraph)
  },

  handleFlowgraphEdgeDelete(edges: Edge[]) {
    return ipcRenderer.invoke('flowgraph-on-edge-delete', edges)
  },

  handleFlowgraphNodeDelete(nodes: Node[]) {
    return ipcRenderer.invoke('flowgraph-on-node-delete', nodes);
  },

  handleNodeChangeData(oldPath: string, newPath: string) {
    return ipcRenderer.invoke('flowgraph-node-change-data', oldPath, newPath)
  },

  selectFolder() {
    return ipcRenderer.invoke('dialog:openDirectory')
  },

  createNewRule(r: Rule) {
    return ipcRenderer.invoke('create-new-rule', r)
  },

  getRules() {
    return ipcRenderer.invoke('get-rules')
  },
  
  deleteRule(index: number) {
    return ipcRenderer.invoke("delete-rule", index)

  },
  
  clearAllRules() {
    return ipcRenderer.invoke('clear-all-rules')
  },

  generateId() {
    return ipcRenderer.invoke('generate-id')
  },

  openFolder(filePath: string) {
    return ipcRenderer.invoke('open-folder', filePath);
  },

  minimizeApp() {
    return ipcRenderer.invoke('minimize-app')
  },

  closeApp() {
    return ipcRenderer.invoke('close-app')
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

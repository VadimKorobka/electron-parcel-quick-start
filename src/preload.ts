import { ipcRenderer, IpcRenderer } from "electron";

export interface FullWindow extends Window {
  ipcRenderer: IpcRenderer;
}

const fullWindow = (<any>window) as FullWindow;

fullWindow.ipcRenderer = ipcRenderer;

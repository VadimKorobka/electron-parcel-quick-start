import { FullWindow } from "../preload";

const fullWindow = (<any>window) as FullWindow;

export default {
  ipcRenderer: fullWindow.ipcRenderer,
};

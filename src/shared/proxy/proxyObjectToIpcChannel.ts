import { ipcMain } from "electron";
import bindToProxyTarget from "./bindToProxyTarget";
const proxyObjectToIpcChannel = <T>(channel: string, target: T) => ipcMain.on(channel, bindToProxyTarget(target, channel));
export default proxyObjectToIpcChannel

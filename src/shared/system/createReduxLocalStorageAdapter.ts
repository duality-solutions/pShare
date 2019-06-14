import pify from 'pify';
import jsonStorage from 'electron-json-storage';
import * as path from 'path'
import { app } from 'electron'
import { asyncFuncWithMaxdop } from "./asyncFuncWithMaxdop";
import { deepEqual } from 'ts-deep-equal'

const storage = pify(jsonStorage);
const pathToDataDir = path.join(app.getPath("home"), ".pshare")
jsonStorage.setDataPath(pathToDataDir)

async function storageImpl(operationAsync: () => Promise<any>, callback: (error: Error | null, v?: any) => void): Promise<void> {
  let v: any;
  try {
    v = await operationAsync();
  } catch (e) {
    callback(e)
    return;
  }
  callback(null, v);
}

const s = asyncFuncWithMaxdop(storageImpl)

const storeMap = new Map<string, any>()

const adapter = {
  async put<T>(key: string, value: T, callback: (error: Error | null, v?: T) => void) {
    if (storeMap.has(key)) {
      const storedValue = storeMap.get(key)
      if (value != null && deepEqual(value, storedValue)) {
        return
      }

    }
    storeMap.set(key, value)
    await s(() => storage.set(key, value), callback);
  },
  async get(key: string, callback: (error: Error | null, v?: any) => void) {
    await s(() => storage.get(key), callback);
  },
  async del(key: string, callback: (error: Error | null, v?: any) => void) {
    storeMap.delete(key)
    await s(() => storage.remove(key), callback);
  }
}

export const createReduxLocalStorageAdapter = () => ({
  put: <T>(key: string, value: T, callback: (error: Error | null, v?: T) => void) => adapter.put(key, value, callback),
  get: <T>(key: string, callback: (error: Error | null, v?: T) => void) => adapter.get(key, callback),
  del: <T>(key: string, callback: (error: Error | null, v?: T) => void) => adapter.del(key, callback)
});
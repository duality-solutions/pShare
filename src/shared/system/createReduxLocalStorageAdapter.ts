import pify from 'pify';
import jsonStorage from 'electron-json-storage';
const storage = pify(jsonStorage);

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

class ReduxLocalStorageAdapter {
  async put<T>(key: string, value: T, callback: (error: Error | null, v?: T) => void) {
    await storageImpl(() => storage.set(key, value), callback);
  }
  async get(key: string, callback: (error: Error | null, v?: any) => void) {
    await storageImpl(() => storage.get(key), callback);
  }
  async del(key: string, callback: (error: Error | null, v?: any) => void) {
    await storageImpl(() => storage.remove(key), callback);

  }
}

export default () => new ReduxLocalStorageAdapter();
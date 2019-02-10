import { ipcRenderer, IpcMessageEvent } from "electron";
import { ProxyResult } from "./ProxyResult";
import { v4 as uuid } from 'uuid';

interface PromiseResolver {
    resolve: Function;
    reject: Function;
}

const proxyMap = new Map<string, any>()

const getProxyForChannel = <T extends object>(channel: string): T => {
    const proxy = proxyMap.get(channel)
    if (proxy) {
        return proxy;
    }
    const newProxy = getProxyForChannelInternal<T>(channel)
    proxyMap.set(channel, newProxy)
    return newProxy
}

const getProxyForChannelInternal = <T extends object>(channel: string): T => {
    let callId = 0;
    const returnMap = new Map<string, PromiseResolver>();

    const uniqueKey = uuid()
    const handler: ProxyHandler<T> = {
        get: (_, propKey) => (...args: any[]) => {
            const thisCallId = `${uniqueKey} : ${callId++}`;
            ipcRenderer.send(channel, thisCallId, propKey, ...args);
            return new Promise((resolve, reject) => {
                returnMap.set(thisCallId, { resolve, reject });
            });
        }
    };
    ipcRenderer.on(channel, (_: IpcMessageEvent, { callId, result, error }: ProxyResult<any>) => {

        const resolver = returnMap.get(callId);

        if (resolver) {
            if (error) {
                resolver.reject(error);
            }
            else {
                resolver.resolve(result);
            }
            returnMap.delete(callId);
        } else {
            console.log(`could not find callId ${callId} in returnMap`);
            return
        }
    });
    const proxy = new Proxy<T>({} as T, handler);
    return proxy;
};

export default getProxyForChannel
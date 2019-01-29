import { IpcMessageEvent } from "electron";
import ProxyResult from "./ProxyResult";
import ArgumentsType from "./ArgumentsType";
import FunctionPropertyNames from "./FunctionPropertyNames";
const bindToProxyTarget = <T>(target: T, channel: string) => async (event: IpcMessageEvent, callId: number, propKey: FunctionPropertyNames<T>, ...remainingArgs: ArgumentsType<T[FunctionPropertyNames<T>]>) => {
    const ff = target[propKey] as any;
    let pr: ProxyResult<any>
    try {
        pr = { callId, result: await ff(...remainingArgs as any[]) };

    } catch (err) {
        pr = { callId, error: { message: err.message, stack: err.stack } };

    }
    event.sender.send(channel, pr);
};
export default bindToProxyTarget
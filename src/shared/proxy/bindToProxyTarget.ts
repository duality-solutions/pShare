import { IpcMessageEvent } from "electron";
import { ProxyResult } from "./ProxyResult";
import { ArgumentsType } from "./ArgumentsType";
import { FunctionPropertyNames } from "./FunctionPropertyNames";
import { prepareErrorForSerialization } from "./prepareErrorForSerialization";
export const bindToProxyTarget =
    <T>(target: T, channel: string) =>
        async (
            event: IpcMessageEvent,
            callId: string,
            propKey: FunctionPropertyNames<T>,
            ...remainingArgs: ArgumentsType<T[FunctionPropertyNames<T>]>
        ) => {
            const ff = target[propKey] as any;
            let pr: ProxyResult<any>
            try {
                pr = { callId, result: await ff(...remainingArgs as any[]) };

            } catch (err) {
                pr = { callId, error: prepareErrorForSerialization(err) };

            }
            event.sender.send(channel, pr);
        };


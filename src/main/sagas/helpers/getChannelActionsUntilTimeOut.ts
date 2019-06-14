import { take, race, call } from "redux-saga/effects";
import { Channel, delay } from "redux-saga";
export function getChannelActionsUntilTimeOut<T>(channel: Channel<T>, timeout: number) {
    return call(function* () {
        const allActions: T[] = [];
        for (; ;) {
            const { channelMessage } = yield race({
                channelMessage: take(channel),
                timeout: delay(timeout)
            });
            if (channelMessage) {
                allActions.push(channelMessage);
            }
            else {
                break;
            }
        }
        return allActions;
    });
}

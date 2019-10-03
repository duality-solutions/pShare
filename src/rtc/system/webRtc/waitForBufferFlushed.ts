import { RTCAnswerPeer } from "./RTCAnswerPeer";
import { delay } from "../../../shared/system/delay";

export const waitForBufferFlushed = async <
    T extends string | Blob | ArrayBuffer | ArrayBufferView
>(
    peer: RTCAnswerPeer<T>
) => {
    const bufferWaitTimeout = delay(120000);
    while (peer && peer.dataChannel && peer.dataChannel.bufferedAmount > 0) {
        const intervalDelay = delay(250);
        const [winningPromise] = await Promise.race(
            [bufferWaitTimeout, intervalDelay].map(p => p.then(() => [p]))
        );

        if (winningPromise === bufferWaitTimeout) {
            break;
        }
    }
};

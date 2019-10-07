import { delay } from "../../../shared/system/delay";
import { OfferPeerEvents } from "./OfferPeerEvents";
import { AnswerPeerEvents } from "./AnswerPeerEvents";
import { RTCPeer } from "./RTCPeer";

export const waitForDrained = async <
    TEvents extends AnswerPeerEvents | OfferPeerEvents,
    T extends string | Blob | ArrayBuffer | ArrayBufferView
>(
    peer: RTCPeer<TEvents, T>
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

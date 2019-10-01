import * as stream from "stream"
import { toBuffer } from "../../../shared/system/bufferConversion";
import { delay } from "../../../shared/system/delay";
import { RTCPeer } from "../../../rtc/system/webRtc/RTCPeer";

const hasArrayBuffer = typeof ArrayBuffer === 'function';
function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return hasArrayBuffer && (value instanceof ArrayBuffer || toString.call(value) === '[object ArrayBuffer]');
}
class RTCPeerReadStream<T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView> extends stream.Readable {
    constructor(private peer: RTCPeer<T, TData>, opts?: stream.ReadableOptions) {
        super(opts)
    }
    _read(size: number): void {
        const messagePromise = this.peer.incomingMessageQueue.receive();
        const timeoutPromise = delay(120000);

        (async () => {
            for (; ;) {
                const [p] = await Promise.race([messagePromise, timeoutPromise].map(p => p.then(() => [p])))
                if (p === timeoutPromise) {
                    throw Error("timeout")
                }
                const data: TData = await (p as Promise<TData>);
                if (!isArrayBuffer(data)) {
                    throw Error("unsupported")
                }
                const pushResult = this.push(toBuffer(data, 0, data.byteLength))
                if (!pushResult) {
                    break;
                }
            }

        })();

    }
}

export const createRTCPeerReadStream =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (peer: RTCPeer<T, TData>, opts?: stream.ReadableOptions) => new RTCPeerReadStream<T, TData>(peer, opts)
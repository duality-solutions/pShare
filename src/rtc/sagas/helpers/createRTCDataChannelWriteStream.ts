import * as stream from "stream"
import { toArrayBuffer } from "../../../shared/system/bufferConversion";
import { createPromiseResolver } from "../../../shared/system/createPromiseResolver";
import { delay } from "../../../shared/system/delay";

const maxSendBuffered = 2097152; // 2MiB

const timeoutOnNoDataMoved = async (dataChannel: RTCDataChannel) => {
    let currBufAmt = dataChannel.bufferedAmount
    let now = performance.now()
    let moved = false
    for (; ;) {
        await delay(250)
        moved = moved || dataChannel.bufferedAmount !== currBufAmt
        currBufAmt = dataChannel.bufferedAmount
        if (moved) {
            now = performance.now()
            moved = false
        } else {
            if ((performance.now() - now) > 120000) {
                break
            }
        }
    }
}

const waitUntilSafeToSend = async (dataChannel: RTCDataChannel) => {
    if (dataChannel.bufferedAmount > maxSendBuffered) {
        const pr = createPromiseResolver<void>();
        dataChannel.onbufferedamountlow = () => pr.resolve();

        const timeout = timeoutOnNoDataMoved(dataChannel)


        await Promise.race([pr.promise, timeout].map(p => p.then(() => [p]))).then(([p]) => {
            if (p === timeout) {
                throw Error("timeout")
            }
        })

    }
}


class RTCDataChannelWriteStream extends stream.Writable {
    constructor(private dataChannel: RTCDataChannel, opts?: stream.WritableOptions) {
        super(opts)
    }
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
        if (!Buffer.isBuffer(chunk)) {
            throw Error("unsupported")
        }
        waitUntilSafeToSend(this.dataChannel).then(() => {
            try {
                this.dataChannel.send(toArrayBuffer(chunk, 0, chunk.length))
            } catch (err) {
                callback(err)
                return
            }
            callback();
        }).catch(err => callback(err))
    }
}

export const createRTCDataChannelWriteStream =
    (dataChannel: RTCDataChannel, opts?: stream.WritableOptions) => new RTCDataChannelWriteStream(dataChannel, opts)
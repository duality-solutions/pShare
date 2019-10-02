import * as stream from "stream";
import { toBuffer } from "../../../shared/system/bufferConversion";
import { delay } from "../../../shared/system/delay";
import { RTCPeer } from "../../../rtc/system/webRtc/RTCPeer";

const hasArrayBuffer = typeof ArrayBuffer === "function";
function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return (
    hasArrayBuffer &&
    (value instanceof ArrayBuffer ||
      toString.call(value) === "[object ArrayBuffer]")
  );
}
class RTCPeerReadStream<
  T extends string,
  TData extends string | Blob | ArrayBuffer | ArrayBufferView
> extends stream.Readable {
  private remaining: number;
  private isReading: boolean;
  private errors: Error[];
  constructor(
    private peer: RTCPeer<T, TData>,
    length: number,
    opts?: stream.ReadableOptions
  ) {
    super(opts);
    this.remaining = length;
    this.isReading = false;
    this.errors = [];
  }
  _read(size: number): void {
    const err =
      this.errors.length > 0 ? this.errors[this.errors.length - 1] : null;
    if (err) {
      throw err;
    }
    if (this.isReading) {
      return;
    }
    this.isReading = true;
    (async () => {
      try {
        for (;;) {
          if (this.remaining === 0) {
            this.push(null);
            break;
          }
          const messagePromise = this.peer.incomingMessageQueue.receive();
          const timeoutPromise = delay(120000);

          const [p] = await Promise.race(
            [messagePromise, timeoutPromise].map(p => p.then(() => [p]))
          );
          if (p === timeoutPromise) {
            throw Error("timeout");
          }
          const data: TData = await (p as Promise<TData>);
          if (!isArrayBuffer(data)) {
            throw Error("unsupported");
          }
          const pushResult = this.push(toBuffer(data, 0, data.byteLength));
          this.remaining -= data.byteLength;
          if (!pushResult) {
            break;
          }
        }
      } catch (err) {
        this.errors.push(err);
      }
      this.isReading = false;
    })();
  }
}

export const createRTCPeerReadStream = <
  T extends string,
  TData extends string | Blob | ArrayBuffer | ArrayBufferView
>(
  peer: RTCPeer<T, TData>,
  length: number,
  opts?: stream.ReadableOptions
) => new RTCPeerReadStream<T, TData>(peer, length, opts);

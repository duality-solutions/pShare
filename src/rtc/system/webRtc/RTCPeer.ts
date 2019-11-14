import { AsyncQueue } from "../../../shared/system/createAsyncQueue";
import { EventEmitterBase } from "../../../shared/system/events/EventEmitterBase";
export interface RTCPeer<T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView> extends EventEmitterBase<T> {
    waitForDataChannelOpen: () => Promise<RTCDataChannel>;
    readonly incomingMessageQueue: AsyncQueue<TData>;
    readonly dataChannel: RTCDataChannel;
    send: (data: TData) => void;
    close: () => Promise<void>;
}

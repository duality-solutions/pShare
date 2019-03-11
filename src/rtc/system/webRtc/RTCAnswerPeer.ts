import { RTCPeer } from "./RTCPeer";
import { AnswerPeerEvents } from "./AnswerPeerEvents";
export interface RTCAnswerPeer<TData extends string | Blob | ArrayBuffer | ArrayBufferView> extends RTCPeer<AnswerPeerEvents, TData> {
    getAnswer: (offer: RTCSessionDescription) => Promise<RTCSessionDescription>;
}

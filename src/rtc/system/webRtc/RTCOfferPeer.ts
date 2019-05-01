import { RTCPeer } from "./RTCPeer";
import { OfferPeerEvents } from "./OfferPeerEvents";
export interface RTCOfferPeer<TData extends string | Blob | ArrayBuffer | ArrayBufferView> extends RTCPeer<OfferPeerEvents, TData> {
    createOffer: () => Promise<RTCSessionDescription>;
    setRemoteDescription: (sessionDescription: RTCSessionDescription) => Promise<void>;
}

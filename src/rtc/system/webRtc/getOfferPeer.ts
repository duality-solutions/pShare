import { createEventEmitter } from "../../../shared/system/events/createEventEmitter";
import { createAsyncQueue } from "../../../shared/system/createAsyncQueue";

type OfferPeerEvents = "icecandidate" | "offer" | "close" | "error" | "open" | "sdp"

export async function getOfferPeer<T extends string | Blob | ArrayBuffer | ArrayBufferView>() {
    const peerConnectionConfig = {
        iceServers: [
            { urls: 'turn:45.77.158.163:3478', username: "test", credential: "Admin@123", }
        ]
    };
    const eventDispatcher = createEventEmitter<OfferPeerEvents>();
    const offerPeer = new RTCPeerConnection(peerConnectionConfig);
    offerPeer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        console.log('offerPeer ice candidate', event);
        if (event.candidate) {
            // These would normally be sent to answerPeer over some other transport,
            // like a websocket, but since this is local we can just set it here.
            //answerPeer.addIceCandidate(event.candidate);

            eventDispatcher.dispatchEvent("icecandidate", event.candidate);
        } else {
            console.log("dispatching local session description")
            eventDispatcher.dispatchEvent("sdp", offerPeer.localDescription);
        }
    };
    const offerDataChannel = offerPeer.createDataChannel('dataChannel', {
        ordered: true
    });
    const queue = createAsyncQueue<T>();

    (async () => {
        const offerInit = await offerPeer.createOffer({});
        const offer = new RTCSessionDescription(offerInit);
        await offerPeer.setLocalDescription(offer);
        eventDispatcher.dispatchEvent("offer", offer);
        //addDataChannelListeners(offerDataChannel, 'offerPeer');
        offerDataChannel.onclose = e => eventDispatcher.dispatchEvent("close", e);
        offerDataChannel.onerror = e => eventDispatcher.dispatchEvent("error", e);
        offerDataChannel.onmessage = e => queue.post(e.data);
        offerDataChannel.onopen = e => eventDispatcher.dispatchEvent("open", e);
    })()

    return {
        setRemoteDescription: (offer: RTCSessionDescription) => offerPeer.setRemoteDescription(offer),
        addIceCandidate: (candidate: RTCIceCandidate) => offerPeer.addIceCandidate(candidate),
        addEventListener: eventDispatcher.addEventListener,
        once: eventDispatcher.once,
        removeEventListener: eventDispatcher.removeEventListener,
        incomingMessageQueue: queue,
        send: (data: T) => offerDataChannel.send(data as any)
    };
}

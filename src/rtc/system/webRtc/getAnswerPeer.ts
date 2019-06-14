import { createEventEmitter } from "../../../shared/system/events/createEventEmitter";
import { createPromiseResolver } from "../../../shared/system/createPromiseResolver";
import { createAsyncQueue } from "../../../shared/system/createAsyncQueue";
import { AnswerPeerEvents } from "./AnswerPeerEvents";
import { RTCAnswerPeer } from "./RTCAnswerPeer";

export async function getAnswerPeer<T extends string | Blob | ArrayBuffer | ArrayBufferView>(peerConnectionConfig: RTCConfiguration): Promise<RTCAnswerPeer<T>> {

    const eventDispatcher = createEventEmitter<AnswerPeerEvents>();

    const peer = new RTCPeerConnection(peerConnectionConfig);

    //const pr = createPromiseResolver<RTCDataChannel>();
    const queue = createAsyncQueue<T>();

    peer.ondatachannel = (event: RTCDataChannelEvent) => {
        const dataChannel = event.channel;
        dataChannel.onclose = e => eventDispatcher.dispatchEvent("close", e);
        dataChannel.onerror = e => eventDispatcher.dispatchEvent("error", e);
        dataChannel.onmessage = e => queue.post(e.data);
        dataChannel.onopen = e => eventDispatcher.dispatchEvent("open", e);

        eventDispatcher.dispatchEvent("datachannel", dataChannel)
    };
    peer.onicecandidate = (event) => {
        console.log('answerPeer ice candidate');
        if (event.candidate) {
            // These would normally be sent to answerPeer over some other transport,
            // like a websocket, but since this is local we can just set it here.
            //answerPeer.addIceCandidate(event.candidate);

            eventDispatcher.dispatchEvent("icecandidate", event.candidate);
        } else {
            console.log("dispatching local session description")
            eventDispatcher.dispatchEvent("sessiondescription", peer.localDescription);
        }
    }


    let dataChannel: RTCDataChannel | undefined;

    return {


        getAnswer: async (offer: RTCSessionDescription) => {
            const pr = createPromiseResolver<RTCSessionDescription>()
            eventDispatcher.once("sessiondescription", (sd: RTCSessionDescription) => pr.resolve(sd))
            await peer.setRemoteDescription(offer)
            const answer = new RTCSessionDescription(await peer.createAnswer({}))
            await peer.setLocalDescription(answer)
            return await pr.promise
        },
        waitForDataChannelOpen: async () => {
            const pr = createPromiseResolver<RTCDataChannel>()
            eventDispatcher.once("datachannel", (dataChannel: RTCDataChannel) => pr.resolve(dataChannel))
            const dc = await pr.promise
            if (dc.readyState !== "open") {
                const prom = createPromiseResolver<void>()
                const res = () => prom.resolve();
                const rej: (evtObj: any) => void = e => prom.reject(e);
                eventDispatcher.addEventListener("open", res)
                eventDispatcher.addEventListener("error", rej)
                try {
                    await (prom.promise)

                } finally {
                    eventDispatcher.removeEventListener("open", res)
                    eventDispatcher.removeEventListener("error", rej)

                }
            }
            dataChannel = dc
            return dc

        },
        addEventListener: eventDispatcher.addEventListener,
        once: eventDispatcher.once,
        removeEventListener: eventDispatcher.removeEventListener,
        get incomingMessageQueue() { return queue },
        get dataChannel() {
            if (dataChannel) {
                return dataChannel
            } else {
                throw Error("RTCDataChannel not yet acquired, did you waitForDataChannelOpen()?")
            }
        },
        send: (data: T) => {
            if (dataChannel) {
                dataChannel.send(data as any);
            } else {
                throw Error("no data channel")
            }

        },
        close: () => {
            dataChannel && dataChannel.close();
            peer.close()
        }
    }
}

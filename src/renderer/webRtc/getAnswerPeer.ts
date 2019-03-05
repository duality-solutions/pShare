// import { createEventEmitter } from "../../shared/system/events/createEventEmitter";
// import { createPromiseResolver } from "../../shared/system/createPromiseResolver";
// import { createAsyncQueue } from "../../shared/system/createAsyncQueue";
// export async function getAnswerPeer<T extends string | Blob | ArrayBuffer | ArrayBufferView>(offer: RTCSessionDescription) {
//     const peerConnectionConfig = {
//         iceServers: [
//             { urls: 'turn:45.77.158.163:3478', username: "test", credential: "Admin@123", }
//         ]
//     };
//     const eventDispatcher = createEventEmitter();

//     const answerPeer = new RTCPeerConnection(peerConnectionConfig);

//     const pr = createPromiseResolver<RTCDataChannel>();

//     answerPeer.ondatachannel = (event: RTCDataChannelEvent) => pr.resolve(event.channel);
//     answerPeer.onicecandidate = (event) => {
//         console.log('answerPeer ice candidate', event);
//         if (event && event.candidate) {
//             // These would normally be sent to offerPeer over some other transport,
//             // like a websocket, but since this is local we can just set it here.
//             //offerPeer.addIceCandidate(event.candidate);
//             eventDispatcher.dispatchEvent("icecandidate", event.candidate);
//         }
//     }

//     await answerPeer.setRemoteDescription(offer)
//     const answer = new RTCSessionDescription(await answerPeer.createAnswer({}))
//     answerPeer.setLocalDescription(answer)
//     eventDispatcher.dispatchEvent("answer", answer)








//     const offerPeer = new RTCPeerConnection(peerConnectionConfig);
//     offerPeer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//         console.log('offerPeer ice candidate', event);
//         if (event && event.candidate) {
//             // These would normally be sent to answerPeer over some other transport,
//             // like a websocket, but since this is local we can just set it here.
//             //answerPeer.addIceCandidate(event.candidate);
//             eventDispatcher.dispatchEvent("icecandidate", event.candidate);
//         }
//     };
//     const offerDataChannel = offerPeer.createDataChannel('dataChannel', {
//         ordered: true
//     });
//     const offerInit = await offerPeer.createOffer({});
//     const offer = new RTCSessionDescription(offerInit);
//     await offerPeer.setLocalDescription(offer);
//     eventDispatcher.dispatchEvent("offer", offer);
//     const queue = createAsyncQueue<T>();
//     //addDataChannelListeners(offerDataChannel, 'offerPeer');
//     offerDataChannel.onclose = e => eventDispatcher.dispatchEvent("close", e);
//     offerDataChannel.onerror = e => eventDispatcher.dispatchEvent("error", e);
//     offerDataChannel.onmessage = e => queue.post(e.data);
//     offerDataChannel.onopen = e => eventDispatcher.dispatchEvent("open", e);
//     const resolver = createPromiseResolver<Event>();
//     eventDispatcher.once("open", resolver.resolve);
//     eventDispatcher.once("error", resolver.reject);
//     await resolver.promise;
//     return {
//         setRemoteDescription: (offer: RTCSessionDescription) => offerPeer.setRemoteDescription(offer),
//         addIceCandidate: (candidate: RTCIceCandidate) => offerPeer.addIceCandidate(candidate),
//         addEventListener: eventDispatcher.addEventListener,
//         removeEventListener: eventDispatcher.removeEventListener,
//         incomingMessageQueue: queue,
//         send: (data: T) => offerDataChannel.send(data as any)
//     };
// }

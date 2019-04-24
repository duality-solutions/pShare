// import { takeEvery, call, put, select } from "redux-saga/effects";
// import { getType, ActionType } from "typesafe-actions";
// import { FileSharingActions, OfferEnvelope, FileRequest } from "../../shared/actions/fileSharing";
// import { PromiseType } from "../../shared/system/generic-types/PromiseType";
// import { getOfferPeer } from "../system/webRtc/getOfferPeer";
// import { RpcClient } from "../../main/RpcClient";
// import { MainRootState } from "../../main/reducers";
// import { v4 as uuid } from 'uuid';
// import { entries } from "../../shared/system/entries";


// //this runs in rtc
// export function* requestFileSaga() {
//     yield takeEvery(getType(FileSharingActions.requestFile), function* (action: ActionType<typeof FileSharingActions.requestFile>) {
//         const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
//         const offer: RTCSessionDescription = yield call(() => peer.createOffer())
//         const offerEnvelope: OfferEnvelope<FileRequest> = { sessionDescription: offer.toJSON(), payload: action.payload, id: uuid(), timestamp: Math.trunc((new Date()).getTime()) }
//         yield put(FileSharingActions.sendOfferEnvelope(offerEnvelope))

//     })
// }
// interface LinkSendMessageResponse {
//     timestamp_epoch: number
//     shared_pubkey: string
//     subject_id: string
//     message_id: string
//     message_hash: string
//     message_size: number
//     signature_size: number
//     check_signature: string
// }
// //runs in main
// export function* sendOfferSaga(rpcClient: RpcClient) {
//     yield takeEvery(
//         getType(FileSharingActions.sendOfferEnvelope),
//         function* (action: ActionType<typeof FileSharingActions.sendOfferEnvelope>) {
//             const { payload: offerEnvelope } = action
//             const { payload: fileRequest } = offerEnvelope
//             const { userName: recipientFileName } = fileRequest
//             const userName: string = yield select((state: MainRootState) => state.user.userName);
//             const response: LinkSendMessageResponse =
//                 yield call(() =>
//                     rpcClient.command(
//                         "link",
//                         "sendmessage",
//                         userName,
//                         recipientFileName,
//                         "pshare-offer",
//                         JSON.stringify(offerEnvelope)))
//         })
// }



// interface LinkMessage {
//     sender_fqdn: string
//     type: string
//     message: string
//     message_id: string
//     message_size: number
//     timestamp_epoch: number
//     record_num: number
// }
// type LinkGetAllMessagesResponse = Record<string, LinkMessage>


// //runs in main
// export function* scanForOffers(rpcClient: RpcClient) {
//     const userName: string = yield select((state: MainRootState) => state.user.userName);
//     for (; ;) {
//         const response: LinkGetAllMessagesResponse =
//             yield call(() =>
//                 rpcClient.command(
//                     "link",
//                     "getmessages",
//                     userName,
//                     "pshare-offer"))
//         const records = entries(response)
//             .select(([, v]) => v)


//     }
// }

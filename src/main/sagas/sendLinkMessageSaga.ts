import { select, takeEvery } from "redux-saga/effects";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { RpcClient } from "../RpcClient";
import { MainRootState } from "../reducers";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getType, ActionType } from "typesafe-actions";
//runs in main
export function* sendLinkMessageSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(FileSharingActions.sendLinkMessage), function* (action: ActionType<typeof FileSharingActions.sendLinkMessage>) {
        const { payload: linkMessage } = action;
        const { payload: fileRequest } = linkMessage;
        const { ownerUserName: recipientUserName } = fileRequest;
        const userName: string = yield select((state: MainRootState) => state.user.userName);
        const response: LinkSendMessageResponse = yield unlockedCommandEffect(rpcClient, command => command("link", "sendmessage", userName, recipientUserName, linkMessage.type, JSON.stringify(linkMessage)));
        // todo
        console.log(response);
    });
}
interface LinkSendMessageResponse {
    timestamp_epoch: number;
    shared_pubkey: string;
    subject_id: string;
    message_id: string;
    message_hash: string;
    message_size: number;
    signature_size: number;
    check_signature: string;
}

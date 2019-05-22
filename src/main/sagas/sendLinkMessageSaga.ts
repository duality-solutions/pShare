import { select, takeEvery } from "redux-saga/effects";
import { RpcClient } from "../RpcClient";
import { MainRootState } from "../reducers";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
//runs in main
export function* sendLinkMessageSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(BdapActions.sendLinkMessage), function* (action: ActionType<typeof BdapActions.sendLinkMessage>) {
        const { payload: {recipient,payload:linkMessage} } = action;
        
        // const { payload: fileRequest } = linkMessage;
        // const { ownerUserName: recipientUserName } = fileRequest;
        
        const userName: string = yield select((state: MainRootState) => state.user.userName);

        const messageJson = JSON.stringify(linkMessage)
        const response: LinkSendMessageResponse = yield unlockedCommandEffect(rpcClient, client => client.command("link", "sendmessage", userName, recipient, "pshare-msg", messageJson));
        // todo
        console.log("link sendmessage response:",response);
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

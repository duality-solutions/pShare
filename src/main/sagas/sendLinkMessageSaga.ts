import { select, takeEvery } from "redux-saga/effects";
import { RpcClient } from "../RpcClient";
import { MainRootState } from "../reducers";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { LinkSendMessageResponse } from "../../dynamicdInterfaces/LinkSendMessageResponse";
//runs in main
export function* sendLinkMessageSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(BdapActions.sendLinkMessage), function* (action: ActionType<typeof BdapActions.sendLinkMessage>) {
        const { payload: {recipient,payload:linkMessage} } = action;
        
        const userName: string = yield select((state: MainRootState) => state.user.userName);

        const messageJson = JSON.stringify(linkMessage)
        const response: LinkSendMessageResponse = yield unlockedCommandEffect(rpcClient, client => client.command("link", "sendmessage", userName, recipient, "pshare-msg", messageJson));
        // todo
        console.log("link sendmessage response:",response);
    });
}


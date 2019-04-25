import { call } from "redux-saga/effects";
import { RpcClient } from "../../RpcClient";
import { entries } from "../../../shared/system/entries";
import { unlockedCommandEffect } from "../effects/unlockedCommandEffect";
import { LinkMessage } from "../../../dynamicdInterfaces/LinkMessage";
export function getLinkMessages(rpcClient: RpcClient, userName: string, messageType: string) {
    return call(function* () {
        const response: LinkGetAllMessagesResponse = yield unlockedCommandEffect(rpcClient, command => command("link", "getmessages", userName, messageType));
        console.log(`getLinkMessages for ${messageType} : success`);
        const records = entries(response)
            .select(([, v]) => v);
        return records;
    });
}
type LinkGetAllMessagesResponse = Record<string, LinkMessage>;

import { call, put, select, take, fork } from "redux-saga/effects";
import { FileSharingActions, LinkMessageEnvelope, FileRequest, FileInfo } from "../../shared/actions/fileSharing";
import { RpcClient } from "../RpcClient";
import { MainRootState } from "../reducers";
import { entries } from "../../shared/system/entries";
import { blinq } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { delay } from "redux-saga";
import { BdapActions } from "../../shared/actions/bdap";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getType } from "typesafe-actions";
import { Action } from "redux";
//runs in main
export function* scanForLinkMessagesSaga(rpcClient: RpcClient) {
    yield take(getType(BdapActions.initialize))

    console.log("scanForOfferSaga starting")

    yield fork(() => scanForLinkMessages(rpcClient, "pshare-offer", function* (lm: LinkMessage) {
        const offerEnvelope: LinkMessageEnvelope<FileRequest> = JSON.parse(lm.message);
        yield put(FileSharingActions.offerEnvelopeReceived(offerEnvelope));
    }))
    yield delay(5000)
    yield fork(() => scanForLinkMessages(rpcClient, "pshare-answer", function* (lm: LinkMessage) {
        const answerEnvelope: LinkMessageEnvelope<FileInfo> = JSON.parse(lm.message);
        yield put(FileSharingActions.answerEnvelopeReceived(answerEnvelope));
    }))


}

function* scanForLinkMessages<T extends Action<any>>(rpcClient: RpcClient, messageType: string, messageHandler: (msg: LinkMessage) => IterableIterator<any>) {
    const userName: string = yield select((state: MainRootState) => state.user.userName);
    const existingRecords: Enumerable<LinkMessage> = yield getLinkMessages(rpcClient, userName, messageType);
    const processedMessages = new Set<string>();
    for (const r of existingRecords) {
        processedMessages.add(r.message_id);
    }
    for (; ;) {
        yield delay(10000);
        let records: Enumerable<LinkMessage>;
        try {
            records = yield getLinkMessages(rpcClient, userName, messageType);
        } catch (e) {
            console.log("error when getOfferMessages : ", e)

            continue
        }
        for (const msg of records) {
            if (!processedMessages.has(msg.message_id)) {
                processedMessages.add(msg.message_id);
                yield* messageHandler(msg)
            }
        }
        const expiredMessageIds = blinq(processedMessages)
            .leftOuterJoin(records, p => p, r => r.message_id, (p, r) => [p, r])
            .where(([, r]) => typeof r === 'undefined')
            .select(([p,]) => p);
        for (const mess_id in expiredMessageIds) {
            processedMessages.delete(mess_id);
        }
    }
}
interface LinkMessage {
    sender_fqdn: string;
    type: string;
    message: string;
    message_id: string;
    message_size: number;
    timestamp_epoch: number;
    record_num: number;
}
type LinkGetAllMessagesResponse = Record<string, LinkMessage>;
function getLinkMessages(rpcClient: RpcClient, userName: string, messageType: string) {
    return call(function* () {
        const response: LinkGetAllMessagesResponse =
            yield unlockedCommandEffect(
                rpcClient,
                command => command("link", "getmessages", userName, messageType))
        console.log(`getLinkMessages for ${messageType} : success`)

        const records = entries(response)
            .select(([, v]) => v);
        return records;
    });
}

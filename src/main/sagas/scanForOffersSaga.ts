import { call, put, select, take } from "redux-saga/effects";
import { FileSharingActions, OfferEnvelope, FileRequest } from "../../shared/actions/fileSharing";
import { RpcClient } from "../RpcClient";
import { MainRootState } from "../reducers";
import { entries } from "../../shared/system/entries";
import { blinq } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { delay } from "redux-saga";
import { BdapActions } from "../../shared/actions/bdap";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getType } from "typesafe-actions";
//runs in main
export function* scanForOffersSaga(rpcClient: RpcClient) {
    yield take(getType(BdapActions.initialize))

    console.log("scanForOfferSaga starting")
    // if(true){
    //     return
    // }
    const userName: string = yield select((state: MainRootState) => state.user.userName);
    const existingRecords: Enumerable<LinkMessage> = yield getOfferMessages(rpcClient, userName);
    const processedMessages = new Set<string>();
    for (const r of existingRecords) {
        processedMessages.add(r.message_id);
    }
    for (; ;) {
        yield delay(10000);
        let records: Enumerable<LinkMessage>;
        try {
            records = yield getOfferMessages(rpcClient, userName);
        } catch (e) {
            console.log("error when getOfferMessages : ", e)

            continue
        }
        for (const r of records) {
            if (!processedMessages.has(r.message_id)) {
                processedMessages.add(r.message_id);
                const offerEnvelope: OfferEnvelope<FileRequest> = JSON.parse(r.message);
                yield put(FileSharingActions.offerEnvelopeReceived(offerEnvelope));
            }
        }
        const expiredMessageIds = blinq(processedMessages)
            .leftOuterJoin(records, p => p, r => r.message_id, (p, r) => [p, r])
            .where(([p, r]) => typeof r === 'undefined')
            .select(([p, r]) => p);
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
function getOfferMessages(rpcClient: RpcClient, userName: string) {
    return call(function* () {
        const response: LinkGetAllMessagesResponse =
            yield unlockedCommandEffect(
                rpcClient,
                command => command("link", "getmessages", userName, "pshare-offer"))
        console.log("getmessages success")

        const records = entries(response)
            .select(([, v]) => v);
        return records;
    });
}

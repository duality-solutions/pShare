import { select } from "redux-saga/effects";
import { RpcClient } from "../../RpcClient";
import { MainRootState } from "../../reducers";
import { blinq } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { delay } from "redux-saga";
import { getLinkMessages } from "./getLinkMessages";
import { LinkMessage } from "../../../dynamicdInterfaces/LinkMessage";
export function* scanForLinkMessages(rpcClient: RpcClient, messageType: string, scanInterval: number, messageHandler: (msg: LinkMessage) => IterableIterator<any>) {
    const userName: string = yield select((state: MainRootState) => state.user.userName);
    const existingRecords: Enumerable<LinkMessage> = yield getLinkMessages(rpcClient, userName, messageType);
    const processedMessages = new Set<string>();
    for (const r of existingRecords) {
        processedMessages.add(r.message_id);
    }
    for (; ;) {
        yield delay(scanInterval);
        let records: Enumerable<LinkMessage>;
        try {
            records = yield getLinkMessages(rpcClient, userName, messageType);
        }
        catch (e) {
            console.log("error when getOfferMessages : ", e);
            continue;
        }
        for (const msg of records) {
            if (!processedMessages.has(msg.message_id)) {
                processedMessages.add(msg.message_id);
                yield* messageHandler(msg);
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

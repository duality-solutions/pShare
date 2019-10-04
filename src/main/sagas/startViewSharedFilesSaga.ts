import { v4 as uuid } from "uuid";
import {
    takeEvery,
    call,
    put,
    select,
    actionChannel,
    flush,
    fork,
    take,
    race,
} from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { MainRootState } from "../reducers";
import { FileListActions } from "../../shared/actions/fileList";
import { SharedFilesActions } from "../../shared/actions/sharedFiles";
import { FileListMessage } from "../../shared/types/FileListMessage";
import { getUserNameFromFqdn } from "../../shared/system/getUserNameFromFqdn";
import { SharedFile } from "../../shared/types/SharedFile";
import { entries } from "../../shared/system/entries";
import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
import { BdapActions } from "../../shared/actions/bdap";
import { delay } from "redux-saga";
import { FileNavigationActions } from "../../shared/actions/fileNavigation";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { FileListRequest } from "../../shared/actions/payloadTypes/FileListRequest";

export function* startViewSharedFilesSaga(rpcClient: RpcClient) {
    yield fork(function*() {
        yield take(getType(BdapActions.initialize));
        const pred = (action: BdapActions) => {
            switch (action.type) {
                case getType(BdapActions.linkMessageReceived):
                    return (
                        action.payload.message.type ===
                        "pshare-filelist-request"
                    );
                default:
                    return false;
            }
        };

        yield takeEvery(pred, function*(
            action: ActionType<typeof BdapActions.linkMessageReceived>
        ) {
            const msg = action.payload;
            const { id } = msg.message;
            const senderFqdn = msg.rawMessage.sender_fqdn;
            const sender = getUserNameFromFqdn(senderFqdn);
            if (sender) {
                const filesRecord: Record<string, SharedFile> = yield select(
                    (s: MainRootState) => {
                        if (s.fileWatch.users[sender]) {
                            return s.fileWatch.users[sender].out;
                        } else {
                            return {};
                        }
                    }
                );
                const sharedFiles: PublicSharedFile[] = entries(filesRecord)
                    .select(([fileName, v]) => ({
                        fileName,
                        //hash: v.hash!,
                        size: v.size!,
                        contentType: v.contentType!,
                    }))
                    .toArray();

                const fileListMessage: FileListMessage = {
                    files: sharedFiles,
                    id,
                };
                yield put(
                    BdapActions.sendLinkMessage({
                        recipient: sender,
                        payload: {
                            id: uuid(),
                            timestamp: Math.trunc(new Date().getTime()),
                            type: "pshare-filelist",
                            payload: fileListMessage,
                        },
                    })
                );
            }
        });
    });
    yield takeEvery(getType(DashboardActions.startViewSharedFiles), function*(
        action: ActionType<typeof DashboardActions.startViewSharedFiles>
    ) {
        yield put(FileNavigationActions.goRoot({ type: "downloadableFiles" }));
        yield put(FileNavigationActions.goRoot({ type: "sharedFiles" }));
        const linkedUserName = action.payload;
        const linkedUserInfo: GetUserInfo = yield call(() =>
            rpcClient.command("getuserinfo", linkedUserName)
        );
        yield put(DashboardActions.viewSharedFiles(linkedUserInfo));
        const chan = yield actionChannel(getType(SharedFilesActions.close));
        const checkClosed = function*() {
            const closeActions: any[] = yield flush(chan);
            return closeActions.some(x => true);
        };
        let fileListMessage: PublicSharedFile[];
        try {
            fileListMessage = yield call(() =>
                getSharedFileListForLink(linkedUserName)
            );
        } catch (err) {
            if (yield* checkClosed()) {
                return;
            }
            yield put(FileListActions.fileListFetchFailed());

            return;
        }
        if (yield* checkClosed()) {
            return;
        }
       
        yield put(FileListActions.fileListFetchSuccess(fileListMessage));

        //yield put(DashboardActions.viewSharedFiles(linkedUserInfo))
    });
}

function* getSharedFileListForLink(linkedUserName: string) {
    const msgId = uuid();
    const myUserName: string = yield select(
        (s: MainRootState) => s.user.userName!
    );

    const req: FileListRequest = {
        fileName: "file-list",
        ownerUserName: linkedUserName,
        requestorUserName: myUserName,
        requestId: msgId,
        type: "file-list",
    };
    yield put(FileSharingActions.startRequestFile(req));

    // yield put(
    //     BdapActions.sendLinkMessage({
    //         recipient: linkedUserName,
    //         payload: {
    //             id: msgId,
    //             timestamp: Math.trunc(new Date().getTime()),
    //             type: "pshare-filelist-request",
    //             payload: { id: msgId },
    //         },
    //     })
    // );

    const pred = (action: FileSharingActions) => {
        switch (action.type) {
            case getType(FileSharingActions.fileListResponse):
                return action.payload.requestId === msgId;
            default:
                return false;
        }
    };
    const {
        action,
        timeout,
        abort,
    }: {
        action: ActionType<typeof FileSharingActions.fileListResponse>;
        timeout: unknown;
        abort: unknown;
    } = yield race({
        timeout: delay(1200000),
        abort: take(getType(DashboardActions.startViewSharedFiles)),
        action: take(pred as any),
    });

    if (timeout) {
        throw Error("timeout");
    }
    if (abort) {
        console.log("file-list-fetch aborted");
        return;
    }

    //const action: ActionType<typeof BdapActions.linkMessageReceived> = yield take(pred)
    console.log("got shared files", action);
    return action.payload.sharedFiles;
}

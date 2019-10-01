import { takeEvery, call, select, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";

import { RpcClient } from "../RpcClient";
import { BdapActions } from "../../shared/actions/bdap";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
// import { app, BrowserWindow, dialog } from "electron";
import * as fs from 'fs';
import { blinq } from "blinq";
import { MainRootState } from "../reducers";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { PendingLink } from "../../dynamicdInterfaces/links/PendingLink";
import { DeniedLink } from "../../dynamicdInterfaces/DeniedLink";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { getUserNameFromFqdn } from "../../shared/system/getUserNameFromFqdn";
import { BulkImportActions } from "../../shared/actions/bulkImport";

export function* previewBulkImportSaga() {
    yield takeEvery(getType(BulkImportActions.previewBulkImport), function*(action: ActionType<typeof BulkImportActions.previewBulkImport>) {
        const filePath = action.payload;
        // console.log(filePath)
        if (filePath == null) {
            yield put(BulkImportActions.bulkImportAborted());
            return;
        }
        const data = yield call (() => readFile(filePath.path))
        yield put(BulkImportActions.previewData(data))
    })
}

export interface RequestStatus {
    link: string,
    status: string,
}

export function* bulkImportSaga(rpcClient: RpcClient, browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(BulkImportActions.beginBulkImport), function* (action: ActionType<typeof BulkImportActions.beginBulkImport>) {

        const data = action.payload;

        const userFqdnsFromFile = [...blinq(splitLines(data))];

        const allUsers: GetUserInfo[] = yield select((s: MainRootState) => s.bdap.users);
        const completeLinks: Link[] = yield select((s: MainRootState) => s.bdap.completeLinks);
        const pendingRequestLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingRequestLinks);
        const deniedRequestLinks: DeniedLink[] = yield select((s: MainRootState) => s.bdap.deniedLinks);
        const currentUserFqdn: string = yield select((s: MainRootState) => typeof s.bdap.currentUser !== 'undefined' ? s.bdap.currentUser.object_full_path : undefined)
        const pendingAcceptLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingAcceptLinks);

        const fqdnRequestStatus: RequestStatus[] = [];

        const completeFqdns =
            blinq(completeLinks)
                .select(l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn));

        // for( const fqdn in completeFqdns ) {
        //     fqdnRequestStatus.push({ link: fqdn, status: 'completed'})
        // }

        const deniedFqdns =
            blinq(deniedRequestLinks)
                .select(l => l.requestor_fqdn);

        // for ( const fqdn in deniedFqdns ) {
        //     fqdnRequestStatus.push({ link: fqdn, status: 'denied' }) 
        // }

        const pendingLinkFqdns =
            blinq(pendingAcceptLinks)
                .concat(pendingRequestLinks)
                .select(l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn));

        // for ( const fqdn in pendingLinkFqdns ) {
        //     fqdnRequestStatus.push({ link: fqdn, status: 'pending' }) 
        // }

        const exclusions =
            completeFqdns
                .concat(deniedFqdns)
                .concat(pendingLinkFqdns)
                .concat([currentUserFqdn])
                .distinct();

        const totalListItems = userFqdnsFromFile.length;

        const fqdnListToUsers = blinq(userFqdnsFromFile)
            .fullOuterJoin(allUsers, x => x, u => u.object_full_path, (listUser, user) => ({ listUser, user }));

        const usersThatExist = fqdnListToUsers.where(x => x.user != null && x.listUser != null).select(x => x.user!);
        const listFqdnsThatDontExist = fqdnListToUsers.where(x => x.listUser != null && x.user == null).select(x => x.listUser!);

        let successCount = 0;
        let failCount = 0;

        for (const userFqdn of listFqdnsThatDontExist) {
            failCount++;
            fqdnRequestStatus.push({ status: 'User does not exist', link: userFqdn })
            yield put(BulkImportActions.bulkImportProgress({
                totalItems: totalListItems,
                failed: failCount,
                successful: successCount,
                currentItem: {
                    linkFqdn: userFqdn,
                    err: "User does not exist",
                    success: false
                }
            }))
        }

        const usersToExclusions = usersThatExist
            .leftOuterJoin(exclusions, u => u.object_full_path, e => e, (user, excludedUserFqdn) => ({ user, excludedUserFqdn }));
        const excludedUserFqdns = usersToExclusions.where(x => x.excludedUserFqdn != null).select(x => x.user.object_full_path);
        for (const userFqdn of excludedUserFqdns) {
            failCount++;
            fqdnRequestStatus.push({ status: 'Link already requested/complete/denied', link: userFqdn })
            yield put(BulkImportActions.bulkImportProgress({
                totalItems: totalListItems,
                failed: failCount,
                successful: successCount,
                currentItem: {
                    linkFqdn: userFqdn,
                    err: "Link already requested/complete/denied",
                    success: false
                }
            }))
        }

        const usersToRequestLink =
            usersToExclusions
                .where(x => x.excludedUserFqdn == null)
                .select(x => x.user);


        // const requestedLinks:  = [];
        const userName = getUserNameFromFqdn(currentUserFqdn);
        const inviteMessage = `${userName} wants to link with you`;
        //const failedUsers: GetUserInfo[] = [];
        for (const user of usersToRequestLink) {
            console.log("inviting " + user.object_id)
            //let response: LinkRequestResponse;
            try {
                yield unlockedCommandEffect(rpcClient, client => client.command("link", "request", userName, user.object_id, inviteMessage))
                successCount++;
                fqdnRequestStatus.push({ status: 'success', link: user.object_full_path})

            } catch (err) {
                failCount++;
                if (/^Insufficient funds/.test(err.message)) {
                    fqdnRequestStatus.push({ status: 'Insufficient funds', link: user.object_full_path })
                    yield put(BulkImportActions.bulkImportFailed(fqdnRequestStatus))
                    yield put(BdapActions.insufficientFunds("request a link to " + user.object_id + " or any more users in the bulk import list"))
                    yield put(BdapActions.getPendingRequestLinks());
                    return;
                } else {
                    fqdnRequestStatus.push({ status: 'Failed', link: user.object_full_path })
                    yield put(BulkImportActions.bulkImportProgress({
                        totalItems: totalListItems,
                        failed: failCount,
                        successful: successCount,
                        currentItem: {
                            linkFqdn: user.object_full_path,
                            success: false,
                            err: err.message
                        }
                    }))
                }

                continue;
            }
            yield put(BdapActions.getBalance())
            yield put(BulkImportActions.bulkImportProgress({
                totalItems: totalListItems,
                failed: failCount,
                successful: successCount,
                currentItem: {
                    linkFqdn: user.object_full_path,
                    success: true
                }
            }))


        }
        yield put(BulkImportActions.bulkImportSuccess(fqdnRequestStatus));
        //console.log("failed users", failedUsers);
        yield put(BdapActions.getPendingRequestLinks());

    });
}

function* splitLines(data: string) {
    const split = data.match(/[^\r\n]+/g);
    if (split) {
        for (const v of split) {
            yield v;
        }
    }
}

// function getFilePathSync(window: BrowserWindow) {
//     const homeDir = app.getPath("documents");
//     const path = dialog.showOpenDialog(window, {
//         // filters: [
//         //     {
//         //         name: "p-share wallet key backup",
//         //         extensions: ["psh.json"]
//         //     }
//         // ],
//         defaultPath: homeDir,
//         title: "Bulk import file",
//         properties: ["multiSelections", "openFile"]

//     });
//     if (path == null) {
//         return undefined;
//     }
//     if (Array.isArray(path) && path.length > 0) {
//         return path[0];
//     }
//     return undefined;
// }

function* readFile(path: string) {
    const buf: Buffer = yield call(() => fs.promises.readFile(path))
    const data = buf.toString();
    return data;
}
import { takeEvery, call, select, put } from "redux-saga/effects";
import { getType } from "typesafe-actions";

import { RpcClient } from "../RpcClient";
import { BdapActions } from "../../shared/actions/bdap";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { app, BrowserWindow, dialog } from "electron";
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

export function* bulkImportSaga(rpcClient: RpcClient, browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(BulkImportActions.beginBulkImport), function* () {
        const browserWindow = browserWindowProvider();
        if (!browserWindow) {
            return;
        }
        const filePath = getFilePathSync(browserWindow);
        if (filePath == null) {
            yield put(BulkImportActions.bulkImportAborted());
            return;
        }
        const data = yield call(() => readFile(filePath))
        const userFqdnsFromFile = [...blinq(splitLines(data))];

        const allUsers: GetUserInfo[] = yield select((s: MainRootState) => s.bdap.users);
        const completeLinks: Link[] = yield select((s: MainRootState) => s.bdap.completeLinks);
        const pendingRequestLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingRequestLinks);
        const deniedRequestLinks: DeniedLink[] = yield select((s: MainRootState) => s.bdap.deniedLinks);
        const currentUserFqdn: string = yield select((s: MainRootState) => typeof s.bdap.currentUser !== 'undefined' ? s.bdap.currentUser.object_full_path : undefined)
        const pendingAcceptLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingAcceptLinks);


        const completeFqdns =
            blinq(completeLinks)
                .select(l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn));
        const deniedFqdns =
            blinq(deniedRequestLinks)
                .select(l => l.requestor_fqdn);

        const pendingLinkFqdns =
            blinq(pendingAcceptLinks)
                .concat(pendingRequestLinks)
                .select(l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn));

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
        const excludedUserFqdns = usersToExclusions.where(x=>x.excludedUserFqdn!=null).select(x=>x.user.object_full_path);
        for (const userFqdn of excludedUserFqdns) {
            failCount++;
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



        const userName = getUserNameFromFqdn(currentUserFqdn);
        const inviteMessage = `${userName} wants to link with you`;
        //const failedUsers: GetUserInfo[] = [];
        for (const user of usersToRequestLink) {
            console.log("inviting " + user.object_id)
            //let response: LinkRequestResponse;
            try {
                yield unlockedCommandEffect(rpcClient, client => client.command("link", "request", userName, user.object_id, inviteMessage))
                successCount++;


            } catch (err) {
                failCount++;
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
                continue;
            }
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
        yield put(BulkImportActions.bulkImportSuccess());
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

function getFilePathSync(window: BrowserWindow) {
    const homeDir = app.getPath("documents");
    const path = dialog.showOpenDialog(window, {
        // filters: [
        //     {
        //         name: "p-share wallet key backup",
        //         extensions: ["psh.json"]
        //     }
        // ],
        defaultPath: homeDir,
        title: "Bulk import file",
        properties: ["multiSelections", "openFile"]

    });
    if (path == null) {
        return undefined;
    }
    if (Array.isArray(path) && path.length > 0) {
        return path[0];
    }
    return undefined;
}

function* readFile(path: string) {
    const buf: Buffer = yield call(() => fs.promises.readFile(path))
    const data = buf.toString();
    return data;
}
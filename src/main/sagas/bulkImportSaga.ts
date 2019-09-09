import { takeEvery, call, select } from "redux-saga/effects";
import { getType } from "typesafe-actions";

import { RpcClient } from "../RpcClient";
import { delay } from "../../shared/system/delay";
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

export function* bulkImportSaga(rpcClient: RpcClient, browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(BdapActions.beginBulkImport), function* () {
        yield call(() => delay(1000))
        const browserWindow = browserWindowProvider();
        if (!browserWindow) {
            return;
        }
        const filePath = getFilePathSync(browserWindow);
        const data = yield call(() => readFile(filePath[0]))
        const userFqdnsFromFile = blinq(splitLines(data));

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

        const usersThatExist = userFqdnsFromFile.join(allUsers, x => x, u => u.object_full_path, (_, u) => u);

        const usersToRequestLink =
            usersThatExist
                .leftOuterJoin(exclusions, u => u.object_full_path, e => e, (user, excludedUserFqdn) => ({ user, excludedUserFqdn }))
                .where(x => x.excludedUserFqdn == null)
                .select(x => x.user);

        console.log(usersToRequestLink.toArray());





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

    });
    return path;
}

function* readFile(path: string) {
    const buf: Buffer = yield call(() => fs.promises.readFile(path))
    const data = buf.toString();
    return data;
}
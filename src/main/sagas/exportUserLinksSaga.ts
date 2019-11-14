import { takeEvery, call, select } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { dialog, app, } from "electron";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import * as path from "path"
import fs from 'fs'
import { DashboardActions } from "../../shared/actions/dashboard";
import { MainRootState } from "../reducers";
import { CompleteLink } from "../../dynamicdInterfaces/links/CompleteLink";
import { PendingLink } from "../../dynamicdInterfaces/links/PendingLink";

export function* exportUserLinksSaga(browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(DashboardActions.exportMyLinks), function* () {
        const browserWindow = browserWindowProvider();
        if (browserWindow == null) {
            return
        }

        const currentUserFqdn: string = yield select((s: MainRootState) => typeof s.bdap.currentUser !== 'undefined' ? s.bdap.currentUser.object_full_path : undefined)
        const links: string[] = []
        const completeLinks: CompleteLink[] = yield select((s: MainRootState) => s.bdap.completeLinks)
        const pendingAcceptLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingAcceptLinks)
        const pendingRequestLinks: PendingLink[] = yield select((s: MainRootState) => s.bdap.pendingRequestLinks)

        completeLinks.map((link: CompleteLink) => {
            link.recipient_fqdn === currentUserFqdn ? 
            links.push(link.requestor_fqdn) : links.push(link.recipient_fqdn)
        })

        pendingAcceptLinks.map((link: PendingLink) => {
            links.push(link.requestor_fqdn)
        })

        pendingRequestLinks.map((link: PendingLink) => {
            links.push(link.recipient_fqdn)
        })

        const fileName = 'User Links export';
        const downloadsDir = app.getPath("downloads");
        const defaultSavePath = path.join(downloadsDir, fileName);

        const showDialog = () => new Promise<string>((resolve, reject) => {
            dialog
                .showSaveDialog(browserWindow, {
                    buttonLabel: "Save",
                    defaultPath: defaultSavePath,
                    title: `Save ${fileName} as...`
                }, (filename) => {
                    if (filename) {
                            fs.writeFileSync(filename, links.join('\n'), 'utf-8');
                            resolve('Success')
                    }
                    else {
                        reject("cancelled");
                    }
                });
        });
        // simple call without try/catch kill the saga monitor in error state (reject)
        try {
            yield call(() => showDialog())
        }
        catch {
            console.log('export-cancelled')
        }
    })
}
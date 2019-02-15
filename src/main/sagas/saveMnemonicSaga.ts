import { app, BrowserWindow, dialog } from "electron";
import * as fs from 'fs';
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { getEncryptor } from "../../shared/system/encryption/getEncryptor";
import { MainRootState } from "../reducers";

export function* saveMnemonicSaga(browserWindowProvider: BrowserWindowProvider) {

    yield takeEvery(
        getType(OnboardingActions.mnemonicFilePasswordSubmit),
        function* (action: ActionType<typeof OnboardingActions.mnemonicFilePasswordSubmit>) {
            const password = action.payload
            if (password.length == 0) {
                yield put(OnboardingActions.mnemonicFileSaveFailed("Password too short"))
                return;
            }
            const mnemonic: string | undefined = yield select((state: MainRootState) => state.user.sessionWalletMnemonic)
            if (typeof (mnemonic) === 'undefined') {
                yield put(OnboardingActions.mnemonicFileSaveFailed("Mnemonic not in memory"))
                return;
            }
            const window = browserWindowProvider()
            if (!window) {
                yield put(OnboardingActions.mnemonicFileSaveFailed("No application window"))
                return;
            }
            var savePath = getSavePathSync(window);
            if (typeof savePath === 'undefined') {
                yield put(OnboardingActions.mnemonicFilePasswordCancelled())
                return
            }
            yield put(OnboardingActions.mnemonicFileSavePathSelected(savePath))
            const { encrypt } = getEncryptor(password)
            const encryptedMnemonic = encrypt(mnemonic)
            try {
                yield call(() => saveFile(savePath, encryptedMnemonic))
            } catch (err) {
                yield put(OnboardingActions.mnemonicFileSaveFailed(`Could not save to ${savePath}. Error: ${err.message}`))
                return
            }
            try {
                yield call(() => verifyFile(password, savePath, mnemonic))
            } catch (err) {
                yield put(OnboardingActions.mnemonicFileSaveFailed(`Could verify file`))
                return
            }
            yield put(OnboardingActions.mnemonicFileSaveSuccess())

        }
    );


}

const verifyFile = async (password: string, filePath: string, expectedContents: string) => {
    const decryptedFileContents = await decryptFile(password, filePath)
    const isOk = decryptedFileContents === expectedContents
    if (!isOk) {
        throw Error("File verification failed")
    }
}
const decryptFile = async (password: string, filePath: string) => {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filePath, (err, buf) => {
            if (err) {
                reject(err)
            } else {
                resolve(buf)
            }
        })
    })
    const contents = buffer.toString("utf8")
    const { decrypt } = getEncryptor(password)
    return decrypt(contents)

}

const saveFile = (path: string, contents: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, contents, function (err) {
            if (err) {
                reject(err)

            }
            else {
                resolve()
            }

        });
    })
}

function getSavePathSync(window: BrowserWindow) {
    const homeDir = app.getPath("documents");
    var savePath = dialog.showSaveDialog(window, {
        filters: [
            {
                name: "p-share wallet key backup",
                extensions: ["psh.json"]
            }
        ],
        defaultPath: homeDir,
        title: "Save p-share wallet key backup"
    });
    return savePath;
}

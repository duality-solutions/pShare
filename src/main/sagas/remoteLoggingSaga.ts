import { takeEvery, call } from "redux-saga/effects";
import { AppActions } from "../../shared/actions/app";
import { getType, ActionType } from "typesafe-actions";
import { getLogger } from "../system/getLogger";
import winston from 'winston'

const isDevelopment = process.env.NODE_ENV === 'development'

const passwordRegex = new RegExp('password','i')
const passphraseRegex = new RegExp('passphrase','i')
const mnemonicRegex = new RegExp('mnemonic','i')

const tokenTester = (item: string) => (passwordRegex.test(item) || passphraseRegex.test(item) || mnemonicRegex.test(item))

export function* remoteLoggingSaga() {
    if (isDevelopment) {
        return;
    }
    yield takeEvery(getType(AppActions.log), function* (action: ActionType<typeof AppActions.log>) {
        const logger: winston.Logger | undefined = yield call(() => getLogger())
        if (typeof logger === 'undefined') {
            return;
        }
        let flag = false 
        action.payload.args.map(item => {
            if (item && typeof item === 'string' && tokenTester(item) ) flag = true
            if (item && typeof item === 'object' && Object.keys(item).some(ele => tokenTester(ele))) flag = true
        })
        if (flag) return;
        const timestamp = new Date().toUTCString()
        switch (action.payload.level) {
            case "error":
                logger.error(["Renderer console", timestamp, ...action.payload.args]);
                break;
            case "warn":
                logger.warn(["Renderer console", timestamp, ...action.payload.args]);
                break;
            case "log":
                logger.info(["Renderer console", timestamp, ...action.payload.args]);
                break;
            case "info":
                logger.info(["Renderer console", timestamp, ...action.payload.args]);
                break;
            default:
                logger.info(["Renderer console", timestamp, ...action.payload.args]);
                break;
        }
    });
}

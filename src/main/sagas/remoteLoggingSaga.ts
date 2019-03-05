import { takeEvery, call } from "redux-saga/effects";
import { AppActions } from "../../shared/actions/app";
import { getType, ActionType } from "typesafe-actions";
import { getLogger } from "../system/getLogger";
import winston from 'winston'

const isDevelopment = process.env.NODE_ENV === 'development'


export function* remoteLoggingSaga() {
    if (isDevelopment) {
        return;
    }
    yield takeEvery(getType(AppActions.log), function* (action: ActionType<typeof AppActions.log>) {
        const logger: winston.Logger | undefined = yield call(() => getLogger())
        if (typeof logger === 'undefined') {
            return;
        }
        switch (action.payload.level) {
            case "error":
                logger.error(["Renderer console", ...action.payload.args]);
                break;
            case "warn":
                logger.warn(["Renderer console", ...action.payload.args]);
                break;
            case "log":
                logger.info(["Renderer console", ...action.payload.args]);
                break;
            case "info":
                logger.info(["Renderer console", ...action.payload.args]);
                break;
            default:
                logger.info(["Renderer console", ...action.payload.args]);
                break;
        }
    });
}

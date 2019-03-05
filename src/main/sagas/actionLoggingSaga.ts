import { takeEvery } from "redux-saga/effects";
import { Action } from "redux";
import { getType } from "typesafe-actions";
import { AppActions } from "../../shared/actions/app";
export function* actionLoggingSaga(tag: string) {
    yield takeEvery("*", (action: Action) => {
        if (action.type === getType(AppActions.log)) {
            return
        }
        console.log(`${tag} action : `, tidySer(action, 512));
    })

}

const tidySer = (obj: any, limit: number) => {
    const output = JSON.stringify(obj, null, 2)

    return output.length > limit ? `${output.substr(0, limit)}...` : output;
}



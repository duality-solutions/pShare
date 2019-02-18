import { takeEvery } from "redux-saga/effects";
export function* loggingSaga(tag: string) {
    yield takeEvery("*", (action: any) => console.log(`${tag} action : `, action))

}

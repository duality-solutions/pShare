import { takeEvery } from "redux-saga/effects";
export function* loggingSaga(tag: string) {
    yield takeEvery("*", (action: any) => console.log(`${tag} action : `, tidySer(action, 100)))

}

const tidySer = (obj: any, limit: number) => {
    const output = JSON.stringify(obj, null, 2)

    return output.length > limit ? `${output.substr(0, limit)}...` : output;
}

import { select, call } from "redux-saga/effects";
import { MainRootState } from "../../reducers";
export function getWalletPassphrase() {
    return call(function* () {
        const password: string | undefined = yield select((state: MainRootState) => state.user.sessionWalletPassword);
        if (typeof password === 'undefined') {
            throw Error("Unexpected: no password.");
        }
        return password;
    });
}

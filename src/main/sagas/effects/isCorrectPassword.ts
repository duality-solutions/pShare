import { call } from "redux-saga/effects";
import { unlockedCommandEffect } from "./unlockedCommandEffect";
export function isCorrectPassword(password: string) {
    return call(function* () {
        try {
            yield unlockedCommandEffect(password, async () => { });
        }
        catch (err) {
            if (/^Error\: The wallet passphrase entered was incorrect\.$/.test(err.message)) {
                return false;
            }
            throw err;
        }
        return true;
    });
}

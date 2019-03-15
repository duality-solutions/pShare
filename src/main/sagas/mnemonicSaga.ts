import { takeEvery, put } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { RpcCommandFunc } from "../RpcCommandFunc";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { HdInfo } from "../../dynamicdInterfaces/HdInfo";

export function* mnemonicSaga() {
    yield takeEvery(getType(OnboardingActions.walletPasswordSetSuccess), function* () {

        const mnemonic: string = yield unlockedCommandEffect(async (command: RpcCommandFunc) => {
            const hdInfo: HdInfo = await command("dumphdinfo");
            return hdInfo.mnemonic;
        })
        yield put(OnboardingActions.mnemonicAcquired(mnemonic))
    })
}


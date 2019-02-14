import { takeEvery, select, put } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { MainRootState } from "../reducers";
import { RpcCommandFunc } from "./effects/helpers/RpcCommandFunc";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { HdInfo } from "../../dynamicdInterfaces/HdInfo";

export function* mnemonicSaga() {
    yield takeEvery(getType(OnboardingActions.mnemonicWarningAccepted), function* () {
        const walletPassword = yield select((state: MainRootState) => state.user.sessionWalletPassword)

        const mnemonic: string = yield unlockedCommandEffect(walletPassword, async (command: RpcCommandFunc) => {
            const hdInfo: HdInfo = await command("dumphdinfo");
            return hdInfo.mnemonic;
        })

        yield put(OnboardingActions.mnemonicAcquired(mnemonic))
    })
}


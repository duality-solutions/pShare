import { call, takeEvery, put } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { getRpcClient } from "../getRpcClient";
import { delay } from "../../shared/system/delay";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";

export function* createBdapAccountSaga(mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.createBdapAccount), function* (action: ActionType<typeof OnboardingActions.createBdapAccount>) {
        const { payload: { userName, commonName, token } } = action
        if (mock) {
            yield* mockSaga(userName)
            return;
        }
        const rawHexTx = yield call(createRawBdapAccount, userName, commonName);
        const txid = yield call(activateAccount, rawHexTx, token)

        let userInfo: GetUserInfo;
        try {
            userInfo = yield* waitForBdapAccountCreated(userName, txid)
        } catch (err) {
            if (/^txid of user does not match supplied value/.test(err.message)) {
                yield put(OnboardingActions.resetOnboarding())
                return;
            }
            throw err
        }
        if (userInfo.common_name !== commonName) {
            throw Error("common_name of GetUserInfo does not match supplied commonName")
        }
        const accountCreatedAction = OnboardingActions.bdapAccountCreated(userName);
        yield put(accountCreatedAction)

    })

}

export const waitForBdapAccountCreated = function* (username: string, txid: string) {
    for (; ;) {
        //todo: consider a timeout or similar
        const [accountCreated, userInfo] = yield call(checkBdapAccountCreated, username, txid)

        if (accountCreated) {
            if (userInfo != null) {
                return userInfo
            }
            throw Error("expected userInfo to be non-null")
        }
        yield call(delay, 5000)
    }
}

export const checkBdapAccountCreated = async (username: string, txId: string): Promise<[boolean, GetUserInfo | null]> => {
    const client = await getRpcClient()
    let userInfo: GetUserInfo;
    try {
        userInfo = await client.command("getuserinfo", username)

    } catch (err) {
        console.log(err)

        if (/^BDAP_SELECT_PUBLIC_USER_RPC_ERROR: ERRCODE: 3600/.test(err.message)) {
            return [false, null];
        }
        if (/^connect ECONNREFUSED/.test(err.message)) {
            throw Error("Could not connect, try again")
        }
        throw err
    }
    if (typeof userInfo === 'undefined') {
        return [false, null]
    }
    if (userInfo.txid === txId) {
        return [true, userInfo]
    }
    throw Error("txid of user does not match supplied value")
}

export const createRawBdapAccount = async (username: string, displayname: string) => {
    const client = await getRpcClient()
    const rawHexTx = await client.command("createrawbdapaccount", username, displayname)
    return rawHexTx
}

export const activateAccount = async (rawHexTx: string, token: string) => {
    await delay(10000)
    const txId = "10c3cd285b1b08747879347648d2d250d31987d23c7a2d087603287c594999a7" //txId for user "batman"
    return txId;
};

function* mockSaga(userName: string) {
    
    yield call(delay, 10000)
    yield put(userName === "failcreatebdap" ? OnboardingActions.createBdapAccountFailed() : OnboardingActions.bdapAccountCreated(userName))
}
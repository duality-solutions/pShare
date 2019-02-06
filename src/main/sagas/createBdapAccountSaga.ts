import { call, takeEvery, put } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { getBitcoinClient } from "../getBitcoinClient";
import delay from "../../shared/system/delay";

export function* createBdapAccountSaga(mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.createBdapAccount), function* (action: ActionType<typeof OnboardingActions.createBdapAccount>) {
        const { payload: { userName: username, commonName: displayname, token } } = action
        if (mock) {
            yield* mockSaga(username === "failcreatebdap")
            return;
        }
        const rawHexTx = yield call(createRawBdapAccount, username, displayname);
        const txid = yield call(activateAccount, rawHexTx, token)

        let userInfo: GetUserInfo;
        try {
            userInfo = yield* waitForBdapAccountCreated(username, txid)
        } catch (err) {
            if (/^txid of user does not match supplied value/.test(err.message)) {
                yield put(OnboardingActions.resetOnboarding())
                return;
            }
            throw err
        }
        const accountCreatedAction = OnboardingActions.bdapAccountCreated(userInfo);
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
    const client = await getBitcoinClient()
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
    const client = await getBitcoinClient()
    const rawHexTx = await client.command("createrawbdapaccount", username, displayname)
    return rawHexTx
}

export const activateAccount = async (rawHexTx: string, token: string) => {
    await delay(10000)
    const txId = "10c3cd285b1b08747879347648d2d250d31987d23c7a2d087603287c594999a7" //txId for user "batman"
    return txId;
};

function* mockSaga(fail = false) {
    const accountCreatedAction = OnboardingActions.bdapAccountCreated({
        _id: "testValue",
        common_name: "testValue",
        dht_publickey: "testValue",
        domain_component: "testValue",
        expired: false,
        expires_on: 123,
        link_address: "testValue",
        object_full_path: "testValue",
        object_id: "testValue",
        object_type: "testValue",
        organization_name: "testValue",
        organizational_unit: "testValue",
        public: 3,
        time: 123,
        txid: "someTxId",
        version: 123,
        wallet_address: "testValue"
    });
    yield call(delay, 5000)
    yield put(fail ? OnboardingActions.resetOnboarding() : accountCreatedAction)
}
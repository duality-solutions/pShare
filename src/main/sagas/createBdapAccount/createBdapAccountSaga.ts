import { call, takeEvery, put } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { delay } from "../../../shared/system/delay";
import { GetUserInfo } from "../../../dynamicdInterfaces/GetUserInfo";
import { httpRequestStringAsync } from "../../system/http/httpRequestAsync";
import { createCancellationTokenSource } from "../../../shared/system/createCancellationTokenSource";
import { AccountActivationResponse } from "./AccountActivationResponse";
import { RpcClient } from "../../../main/RpcClient";
//import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";

export function* createBdapAccountSaga(rpcClient: RpcClient, mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.createBdapAccount), function* (action: ActionType<typeof OnboardingActions.createBdapAccount>) {
        let { payload: { userName, commonName, token } } = action
        if (mock) {
            yield* mockSaga(userName)
            return;
        }
        let rawHexTx: string
        try {
            rawHexTx = yield call(() => createRawBdapAccount(rpcClient, userName, commonName));
        } catch (err) {
            yield put(OnboardingActions.createBdapAccountFailed("createRawBdapAccount failed"))
            return;
        }
        let txid: string
        try {
            txid = yield call(activateAccount, rawHexTx, token)
        } catch (err) {
            const regex = /^Error: Activation service responded with status code\: \d*/;

            if (regex.test(err.message)) {
                yield put(OnboardingActions.createBdapAccountFailed(`Activation error response : ${err.message}`))
                return;
            }
            const regex2 = /^Unsuccessful: Activation service response/
            if (regex2.test(err.message)) {
                // yield put(OnboardingActions.createBdapAccountFailed(`Activation was unsuccessful : ${err.message}`))
                yield put(OnboardingActions.createBdapAccountFailed('Invalid Token'))
                return;
            }

            throw err;

        }

        let userInfo: GetUserInfo;
        try {
            userInfo = yield* waitForBdapAccountCreated(rpcClient, userName, txid)
        } catch (err) {
            if (/^txid of user does not match supplied value/.test(err.message)) {
                yield put(OnboardingActions.createBdapAccountFailed("Try a different user name"))
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

export const waitForBdapAccountCreated = function* (rpcClient: RpcClient, username: string, txid: string) {
    for (; ;) {
        //todo: consider a timeout or similar
        console.log("checking if bdap account has been created")
        const [accountCreated, userInfo] = yield call(() => checkBdapAccountCreated(rpcClient, username, txid))

        if (accountCreated) {
            if (userInfo != null) {
                console.log("bdap account has been created")

                return userInfo
            }
            throw Error("expected userInfo to be non-null")
        }
        console.log("bdap account has not yet been created, waiting 5s")

        yield call(delay, 5000)
    }
}

export const checkBdapAccountCreated = async (client: RpcClient, username: string, txId: string): Promise<[boolean, GetUserInfo | null]> => {

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

export const createRawBdapAccount = async (rpcClient: RpcClient, username: string, displayname: string) => {

    const rawHexTx = await rpcClient.command("createrawbdapaccount", username, displayname)
    return rawHexTx
}

export const activateAccount = async (rawHexTx: string, token: string) => {
    const serviceUrl = `https://pshare.duality.solutions/callback?token=${encodeURIComponent(token)}&tx=${encodeURIComponent(rawHexTx)}`
    console.log(serviceUrl)
    const cts = createCancellationTokenSource()
    const { responseString, response } = await httpRequestStringAsync({ url: serviceUrl, method: "GET" }, cts.getToken())

    let parsedResponse: AccountActivationResponse

    try {
        parsedResponse = JSON.parse(responseString)
    } catch (err) {
        console.warn(`response not JSON: ${responseString}`)
        throw Error(`Error: Activation service responded with status code: ${response.statusCode}, 
        status-message: ${response.statusMessage}, 
        body: ${responseString}`)
    }

    if (typeof parsedResponse !== 'undefined' && typeof parsedResponse.content !== 'undefined' && typeof parsedResponse.success !== 'undefined') {
        if (typeof response.statusCode !== 'undefined' && response.statusCode === 200) {
            if (parsedResponse.success) {
                console.log(`received txid : ${parsedResponse.content}`)
                return parsedResponse.content;
            }
        }
        throw Error(`Unsuccessful: Activation service response (status:${response.statusCode}, success:${parsedResponse.success}) : "${parsedResponse.content}"`)
    }
    else {
        throw Error(`Error: Activation service responded with status code: ${response.statusCode}, 
        status-message: ${response.statusMessage}, 
        body: ${responseString}`)
    }

};

function* mockSaga(userName: string) {

    yield call(delay, 10000)
    yield put(userName === "failcreatebdap" ? OnboardingActions.createBdapAccountFailed("mocked failure") : OnboardingActions.bdapAccountCreated(userName))
}
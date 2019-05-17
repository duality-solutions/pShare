import { takeEvery, put, call, select, take, all, race } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { RpcClient } from "../RpcClient";
import { LinkResponse } from "../../dynamicdInterfaces/links/LinkResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { entries } from "../../shared/system/entries";
import { blinq } from "blinq";
import { delay } from "redux-saga";
import { LinkDeniedResponse } from "../../dynamicdInterfaces/LinkDeniedResponse";
import { CompleteLink } from "../../dynamicdInterfaces/links/CompleteLink";

export function* bdapSaga(rpcClient: RpcClient, mock: boolean = false) {
    yield takeEvery(getType(BdapActions.getUsers), function* () {

        let response: GetUserInfo[];
        try {
            response = yield call(() => rpcClient.command("getusers"))

        } catch (err) {
            yield put(BdapActions.getUsersFailed(err.message))
            return
        }
        const currentUserName: string | undefined = yield select((state: MainRootState) => state.user.userName)
        if (typeof currentUserName !== 'undefined') {
            const currentUser = blinq(response).singleOrDefault(r => r.object_id === currentUserName)
            if (typeof currentUser !== 'undefined') {
                yield put(BdapActions.currentUserReceived(currentUser))
            }
        }
        yield put(BdapActions.getUsersSuccess(response))
    })
    yield takeEvery(getType(BdapActions.getPendingAcceptLinks), function* () {

        yield* rpcLinkCommand(rpcClient, (client) => client.command("link", "pending", "accept"), BdapActions.getPendingAcceptLinksSuccess, BdapActions.getPendingAcceptLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getPendingRequestLinks), function* () {

        yield* rpcLinkCommand(rpcClient, (client) => client.command("link", "pending", "request"), BdapActions.getPendingRequestLinksSuccess, BdapActions.getPendingRequestLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getCompleteLinks), function* () {


        //const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: LinkResponse<CompleteLink>;
        try {
            response = yield call(() => rpcClient.command("link", "complete"))

        } catch (err) {
            yield put(BdapActions.getCompleteLinksFailed(err.message))
            return
        }

        const links = extractLinks<CompleteLink>(response);


        yield put(BdapActions.getCompleteLinksSuccess(links))

    })


    yield takeEvery(getType(BdapActions.getDeniedLinks), function* () {

        const currentUser: GetUserInfo = yield getCurrentUser()
        const userName = currentUser.object_id
        let response: LinkDeniedResponse | {};

        try {
            response = yield unlockedCommandEffect(rpcClient, client => client.command("link", "denied", userName))

        } catch (err) {
            if (!/^DeniedLinkList: ERRCODE: 5604/.test(err.message)) {
                yield put(BdapActions.getDeniedLinksFailed(err.message))
                return
            }
            response = {}

        }

        if (isLinkDeniedResponse(response)) {
            const deniedList = entries(response.denied_list).select(([, v]) => v).toArray()
            yield put(BdapActions.getDeniedLinksSuccess(deniedList))
        }
        else {
            yield put(BdapActions.getDeniedLinksSuccess([]))
        }

    })

    yield takeEvery(getType(BdapActions.initialize), function* () {
        for (; ;) {


            yield put(BdapActions.getUsers())

            yield put(BdapActions.getCompleteLinks())
            yield put(BdapActions.getPendingAcceptLinks())
            yield put(BdapActions.getPendingRequestLinks())
            yield put(BdapActions.getDeniedLinks())

            const getResults = yield all({
                users: race({
                    success: take(getType(BdapActions.getUsersSuccess)),
                    failure: take(getType(BdapActions.getUsersFailed))
                }),
                completeLinks: race({
                    success: take(getType(BdapActions.getCompleteLinksSuccess)),
                    failure: take(getType(BdapActions.getCompleteLinksFailed))
                }),
                pendingRequest: race({
                    success: take(getType(BdapActions.getPendingRequestLinksSuccess)),
                    failure: take(getType(BdapActions.getPendingRequestLinksFailed))
                }),
                pendingAccept: race({
                    success: take(getType(BdapActions.getPendingAcceptLinksSuccess)),
                    failure: take(getType(BdapActions.getPendingAcceptLinksFailed))
                }),
                denied: race({
                    success: take(getType(BdapActions.getDeniedLinksSuccess)),
                    failure: take(getType(BdapActions.getDeniedLinksFailed))

                })
            })

            if (getResults.users.success
                && getResults.completeLinks.success
                && getResults.pendingRequest.success
                && getResults.pendingAccept.success
                && getResults.denied.success
            ) {
                console.log("all user/link data successful retrieved")


                yield put(BdapActions.bdapDataFetchSuccess())

            }
            else {
                console.warn("some user/link data was not successfully retrieved")
                //todo: report this, somehow
                yield put(BdapActions.bdapDataFetchFailed("some user/link data was not successfully retrieved"))

            }
            yield delay(60000)
        }

    })
}

const reservedKeyNames = ["locked_links"]
const extractLinks = <T extends Link>(response: LinkResponse<T>): T[] =>
    entries(response)
        .leftOuterJoin(reservedKeyNames, ([k,]) => k, rkn => rkn, (entry, rkn) => ({ entry, rkn }))
        .where(({ rkn }) => typeof rkn === "undefined")
        .select(({ entry: [, v] }) => v)
        .toArray()



const getCurrentUser = () =>
    call(function* () {
        let currentUser: GetUserInfo = yield select((state: MainRootState) => state.bdap.currentUser);
        if (typeof currentUser === 'undefined') {
            const a: ActionType<typeof BdapActions.currentUserReceived> = yield take(getType(BdapActions.currentUserReceived));
            currentUser = a.payload;
        }
        return currentUser;
    })

function* rpcLinkCommand<T extends Link>(
    rpcClient: RpcClient,
    cmd: (client: RpcClient) => Promise<LinkResponse<T>>,
    successActionCreator: (entries: T[]) => any,
    failActionCreator: (message: string) => any
) {

    let response: LinkResponse<T>;
    try {
        response = yield unlockedCommandEffect(rpcClient, cmd)
    } catch (err) {
        yield put(failActionCreator(err.message))
        return;
    }
    const links = extractLinks<T>(response)
    yield put(successActionCreator(links))
}

function isLinkDeniedResponse(obj: LinkDeniedResponse | {}): obj is LinkDeniedResponse {
    return (<LinkDeniedResponse>obj).list_updated !== undefined;
}


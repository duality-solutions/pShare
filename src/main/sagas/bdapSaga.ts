import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { RpcClient } from "../RpcClient";
import { LinkResponse } from "../../dynamicdInterfaces/links/LinkResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { RpcCommandFunc } from "../RpcCommandFunc";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { entries } from "../../shared/system/entries";
import { blinq } from "blinq";
import { delay } from "redux-saga";

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
        if (mock) {
            const userFqdn: string = yield getUserFqdn();
            const p = blinq(mockPendingAcceptLinks).select(l => ({ ...l, recipient_fqdn: userFqdn })).toArray()
            yield put(BdapActions.getPendingAcceptLinksSuccess(p))
            return
        }
        yield* rpcLinkCommand(rpcClient,(command) => command("link", "pending", "accept"), BdapActions.getPendingAcceptLinksSuccess, BdapActions.getPendingAcceptLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getPendingRequestLinks), function* () {
        if (mock) {
            const userFqdn: string = yield getUserFqdn();
            const p = blinq(mockPendingRequestLinks).select(l => ({ ...l, requestor_fqdn: userFqdn })).toArray()
            yield put(BdapActions.getPendingRequestLinksSuccess(p))
            return
        }
        yield* rpcLinkCommand(rpcClient,(command) => command("link", "pending", "request"), BdapActions.getPendingRequestLinksSuccess, BdapActions.getPendingRequestLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getCompleteLinks), function* () {
        if (mock) {
            const userFqdn: string = yield getUserFqdn();
            const p = blinq(mockCompleteLinks).select(l => (l.requestor_fqdn === 'bob@public.bdap.io' ? { ...l, requestor_fqdn: userFqdn } : { ...l, recipient_fqdn: userFqdn })).toArray()
            yield put(BdapActions.getCompleteLinksSuccess(p))
            return
        }
        //const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: LinkResponse<Link>;
        try {
            response = yield call(() => rpcClient.command("link", "complete"))

        } catch (err) {
            yield put(BdapActions.getCompleteLinksFailed(err.message))
            return
        }
        yield put(BdapActions.getCompleteLinksSuccess(extractLinks(response)))

    })

    yield takeEvery(getType(BdapActions.initialize), function* () {

        for (; ;) {
            yield put(BdapActions.getUsers())

            yield put(BdapActions.getCompleteLinks())
            yield put(BdapActions.getPendingAcceptLinks())
            yield put(BdapActions.getPendingRequestLinks())

            yield delay(60000)
        }

    })
}


const extractLinks = <T extends Link>(response: LinkResponse<T>): T[] => entries(response).select(([, v]) => v).toArray()


const getUserFqdn = () =>
    call(function* () {
        let currentUser: GetUserInfo = yield select((state: MainRootState) => state.bdap.currentUser);
        if (typeof currentUser === 'undefined') {
            const a: ActionType<typeof BdapActions.currentUserReceived> = yield take(getType(BdapActions.currentUserReceived));
            currentUser = a.payload
        }
        return currentUser.object_full_path;
    })

function* rpcLinkCommand<T extends Link>(
    rpcClient:RpcClient,
    cmd: (c: RpcCommandFunc) => Promise<LinkResponse<T>>,
    successActionCreator: (entries: T[]) => any,
    failActionCreator: (message: string) => any
) {

    let response: LinkResponse<T>;
    try {
        response = yield unlockedCommandEffect(rpcClient,cmd)
    } catch (err) {
        yield put(failActionCreator(err.message))
        return;
    }
    const links = extractLinks(response)
    yield put(successActionCreator(links))
}

const mockPendingAcceptLinks = [{
    "requestor_fqdn": "dynode07@public.bdap.io",
    "recipient_fqdn": "bob@public.bdap.io",
    "requestor_link_pubkey": "4189ee55dd11ae599123ddd75ed54db0be091651b60556d330996105057621f1",
    "txid": "749f2e8a01bb4dbbc39e2332d068e447bf46c081eac1583a90f6d798c00e31f1",
    "time": 1549949065,
    "expires_on": 1613107465,
    "expired": false,
    "link_message": "Hi Bob"
},
{
    "requestor_fqdn": "dave11@public.bdap.io",
    "recipient_fqdn": "bob@public.bdap.io",
    "requestor_link_pubkey": "4a7fc8d23ccf31a2cac3c61107b8c2d3b2bed18ba83153d00c34dcb1a7facdf1",
    "txid": "312c067e16b3ea5d749b9be37ee8ed8b49a5ef7bfcfad665a62b3eb587362cd1",
    "time": 1550276221,
    "expires_on": 1613434621,
    "expired": false,
    "link_message": "this is dave. please accept"
}]
const mockPendingRequestLinks = [{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "common@public.bdap.io",
    "requestor_link_pubkey": "0c84359bf21a6fcfe2b1a9f04b14a7ac477d27df04b1651430d2ce38001ed252",
    "txid": "9be6fc869857ffcb6efa90564870bb9c45ac4ac9f9fbd40043d212b94dbd3cfc",
    "time": 1550095586,
    "expires_on": 1613253986,
    "expired": false,
    "link_message": "Hi"
},
{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "laptop@public.bdap.io",
    "requestor_link_pubkey": "24b1281d8f5e389514a58d7408ab2206e586d26b42bd3c5650d0ddedd707a7e2",
    "txid": "21f518e646891d4bb99b2ac061deb4caeeb52ab0c4e25f3d20b89e548fe2c6e4",
    "time": 1550094743,
    "expires_on": 1613253143,
    "expired": false,
    "link_message": "Hi common, "
}]
const mockCompleteLinks = [{
    "requestor_fqdn": "catatafish@public.bdap.io",
    "recipient_fqdn": "bob@public.bdap.io",
    "recipient_link_pubkey": "0cd1c21290bfb2daf6c3d99afa7a0dc5786a3b32e8060297ed75fb4ac92dfbef",
    "txid": "c7de4f46abe33906e6c4abb52832b787a9600637c7045390dd08684e1ab502b8",
    "time": 1550096686,
    "expires_on": 1613255086,
    "expired": false
},
{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "amirabrams@public.bdap.io",
    "recipient_link_pubkey": "1f53b12cfe29701cc1664974d3d5371d6ce1ed1b80aca6804144360939f8e97d",
    "txid": "27ea2ea4256b07b157c233f88d12cc2689ea406694badee1560258fbbdb5d568",
    "time": 1549948489,
    "expires_on": 1613106889,
    "expired": false
},
{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "dave6@public.bdap.io",
    "recipient_link_pubkey": "24dc39173f0c6808898bbf1170e90621a570d5f271e0da289926c5ff8f9440ce",
    "txid": "f04b5b05f0077076a982d1b3a4d517cd2cd73527fc845b4fb95fbbecc88b5cb8",
    "time": 1550509965,
    "expires_on": 1613668365,
    "expired": false
},
{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "dynode05@public.bdap.io",
    "recipient_link_pubkey": "bbe3d90450b89d7ac3e5d1cbebb01b1a44e13b0731b9b6cd46b4661e3050f458",
    "txid": "7470fd99aa1e987067fde9c9ea724bcdc214cc663c56922352e56a17d8bde63c",
    "time": 1550209032,
    "expires_on": 1613367432,
    "expired": false
},
{
    "requestor_fqdn": "bob@public.bdap.io",
    "recipient_fqdn": "spencer@public.bdap.io",
    "recipient_link_pubkey": "cec09d4843de7d61d291ab8c1e30cb88e4da9990f5038d0b3c40612fc3b55feb",
    "txid": "ba5d275cdac71cc0dd864583c95024fa794636e539299663726a726a24e04913",
    "time": 1550705345,
    "expires_on": 1613863745,
    "expired": false
}]
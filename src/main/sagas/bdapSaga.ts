import { takeEvery, put, call, select, take, race } from "redux-saga/effects";
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
import { tuple } from "../../shared/system/tuple";
import { getFirstBdapAccount } from "./helpers/getFirstBdapAccount";
import { BdapAccount } from "../../dynamicdInterfaces/BdapAccount";

type Report = { success: any; failure: any };
type ResultsReport = Record<keyof typeof operations, Report>;
type Frequency = "repeated" | "once";
interface BdapOperation {
    action: any;
    successAction: any;
    failureAction: any;
    frequency: Frequency;
}
const operations: Record<string, BdapOperation> = {
    users: {
        action: () => BdapActions.getUsers(),
        successAction: BdapActions.getUsersSuccess,
        failureAction: BdapActions.getUsersFailed,
        frequency: "repeated",
    },
    completeLinks: {
        action: () => BdapActions.getCompleteLinks(),
        successAction: BdapActions.getCompleteLinksSuccess,
        failureAction: BdapActions.getCompleteLinksFailed,
        frequency: "repeated",
    },
    pendingRequestLinks: {
        action: () => BdapActions.getPendingRequestLinks(),
        successAction: BdapActions.getPendingRequestLinksSuccess,
        failureAction: BdapActions.getPendingRequestLinksFailed,
        frequency: "repeated",
    },
    pendingAcceptLinks: {
        action: () => BdapActions.getPendingAcceptLinks(),
        successAction: BdapActions.getPendingAcceptLinksSuccess,
        failureAction: BdapActions.getPendingAcceptLinksFailed,
        frequency: "repeated",
    },
    deniedLinks: {
        action: () => BdapActions.getDeniedLinks(),
        successAction: BdapActions.getDeniedLinksSuccess,
        failureAction: BdapActions.getDeniedLinksFailed,
        frequency: "repeated",
    },
    balance: {
        action: () => BdapActions.getBalance(),
        successAction: BdapActions.getBalanceSuccess,
        failureAction: BdapActions.getBalanceFailed,
        frequency: "repeated",
    },
    topUpAddress: {
        action: () => BdapActions.getTopUpAddress(),
        successAction: BdapActions.getTopUpAddressSuccess,
        failureAction: BdapActions.getTopUpAddressFailed,
        frequency: "once",
    },
};

type OperationCounts = Record<keyof typeof operations, number>;

export function* bdapSaga(rpcClient: RpcClient, mock: boolean = false) {
    yield takeEvery(getType(BdapActions.getUsers), function*() {
        let response: GetUserInfo[];
        try {
            response = yield call(() => rpcClient.command("getusers"));
        } catch (err) {
            yield put(BdapActions.getUsersFailed(err.message));
            return;
        }
        const currentUserName: string | undefined = yield select(
            (state: MainRootState) => state.user.userName
        );
        if (typeof currentUserName !== "undefined") {
            const currentUser = blinq(response).singleOrDefault(
                r => r.object_id === currentUserName
            );
            if (typeof currentUser !== "undefined") {
                yield put(BdapActions.currentUserReceived(currentUser));
            }
        }
        yield put(BdapActions.getUsersSuccess(response));
    });
    yield takeEvery(getType(BdapActions.getBalance), function*() {
        let balance: number;
        try {
            balance = yield unlockedCommandEffect(rpcClient, async client => {
                const b: number = await client.command("getbalance");
                const cr: { total_credits: number } = await client.command(
                    "getcredits"
                );
                const tc = cr.total_credits;
                const bc = Math.trunc(b / 0.00100001);
                return tc + bc;
            });
        } catch (err) {
            yield put(BdapActions.getBalanceFailed(err.message));
            return;
        }
        yield put(BdapActions.getBalanceSuccess(balance));
    });
    yield takeEvery(getType(BdapActions.getTopUpAddress), function*() {
        let topUpAddress: string | undefined;
        try {
            const bdapAcct: BdapAccount = yield getFirstBdapAccount(rpcClient);
            topUpAddress = bdapAcct.link_address;
        } catch (err) {
            yield put(BdapActions.getTopUpAddressFailed(err.message));
            return;
        }

        yield put(BdapActions.getTopUpAddressSuccess(topUpAddress!));
    });
    yield takeEvery(getType(BdapActions.getPendingAcceptLinks), function*() {
        yield* rpcLinkCommand(
            rpcClient,
            client => client.command("link", "pending", "accept"),
            BdapActions.getPendingAcceptLinksSuccess,
            BdapActions.getPendingAcceptLinksFailed
        );
    });
    yield takeEvery(getType(BdapActions.getPendingRequestLinks), function*() {
        yield* rpcLinkCommand(
            rpcClient,
            client => client.command("link", "pending", "request"),
            BdapActions.getPendingRequestLinksSuccess,
            BdapActions.getPendingRequestLinksFailed
        );
    });
    yield takeEvery(getType(BdapActions.getCompleteLinks), function*() {
        //const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: LinkResponse<CompleteLink>;
        try {
            response = yield call(() => rpcClient.command("link", "complete"));
        } catch (err) {
            yield put(BdapActions.getCompleteLinksFailed(err.message));
            return;
        }

        const links = extractLinks<CompleteLink>(response);

        yield put(BdapActions.getCompleteLinksSuccess(links));
    });

    yield takeEvery(getType(BdapActions.getDeniedLinks), function*() {
        const currentUser: GetUserInfo = yield getCurrentUser();
        const userName = currentUser.object_id;
        let response: LinkDeniedResponse | {};

        try {
            response = yield unlockedCommandEffect(rpcClient, client =>
                client.command("link", "denied", userName)
            );
        } catch (err) {
            //if (!/^DeniedLinkList: ERRCODE: 5604/.test(err.message)) {
            //    yield put(BdapActions.getDeniedLinksFailed(err.message))
            //    return
            //}
            response = {};
        }

        if (isLinkDeniedResponse(response)) {
            const deniedList = entries(response.denied_list)
                .select(([, v]) => v)
                .toArray();
            yield put(BdapActions.getDeniedLinksSuccess(deniedList));
        } else {
            yield put(BdapActions.getDeniedLinksSuccess([]));
        }
    });

    yield takeEvery(getType(BdapActions.initialize), function*() {
        let operationCounts: OperationCounts = entries(operations)
            .select(([k, v]) => tuple(k, 0))
            .aggregate({}, (p, [k, v]) => ({ ...p, [k]: v }));

        //let allSourcesRetrievedAtLeastOnce = false

        for (;;) {
            let remainingEntries = entries(operations)
                .join(
                    entries(operationCounts),
                    ([k]) => k,
                    ([k]) => k,
                    ([k, vo], [, vc]) => tuple(k, vo, vc)
                )
                .where(
                    ([, vo, vc]) =>
                        vo.frequency === "repeated" ||
                        (vo.frequency === "once" && vc === 0)
                )
                .select(([k, vo]) => tuple(k, vo));

            console.log(
                "remaining entries",
                remainingEntries.select(([k]) => k).toArray()
            );

            for (let attempts = 0; remainingEntries.any(); attempts++) {
                if (attempts >= 3) {
                    throw Error(
                        `Could not retrieve ${[
                            ...remainingEntries.select(([k]) => k),
                        ].join(", ")} lists from dynamicd`
                    );
                }

                const remainingActions = remainingEntries.select(([k, v]) => ({
                    key: k,
                    effect: put(v.action()),
                    successAction: v.successAction,
                    failureAction: v.failureAction,
                }));
                let resultsReport: ResultsReport = {};
                for (const v of remainingActions) {
                    yield v.effect;
                    const r = yield race({
                        success: take(getType(v.successAction)),
                        failure: take(getType(v.failureAction)),
                    });
                    resultsReport = { ...resultsReport, [v.key]: r };
                }

                const resultEntries = entries(resultsReport);

                const entriesWithResults = remainingEntries.join(
                    resultEntries,
                    ([k]) => k,
                    ([k]) => k,
                    ([k, vo], [, vr]) => ({ key: k, operation: vo, result: vr })
                );

                const failedEntries = entriesWithResults.where(
                    ({ result: { failure } }) => failure
                );
                const successEntries = entriesWithResults.where(
                    ({ result: { success } }) => success
                );

                operationCounts = entries(operationCounts)
                    .leftOuterJoin(
                        successEntries,
                        ([k]) => k,
                        e => e.key,
                        (oe, se) => (se ? tuple(oe[0], oe[1] + 1) : oe)
                    )
                    .aggregate({}, (p, [k, v]) => ({ ...p, [k]: v }));

                remainingEntries = failedEntries.select(e =>
                    tuple(e.key, e.operation)
                );
            }
            //allSourcesRetrievedAtLeastOnce = true;
            if (!remainingEntries.any()) {
                yield put(BdapActions.bdapDataFetchSuccess());
            } else {
                const msg = `some user/link data was not successfully retrieved [${[
                    ...remainingEntries.select(([k]) => k),
                ].join(", ")}]`;
                yield put(BdapActions.bdapDataFetchFailed(msg));
            }
            console.log("operation counts", operationCounts);
            yield delay(60000);
        }
    });
}

const reservedKeyNames = ["locked_links"];
const extractLinks = <T extends Link>(response: LinkResponse<T>): T[] =>
    entries(response)
        .leftOuterJoin(
            reservedKeyNames,
            ([k]) => k,
            rkn => rkn,
            (entry, rkn) => ({ entry, rkn })
        )
        .where(({ rkn }) => typeof rkn === "undefined")
        .select(({ entry: [, v] }) => v)
        .toArray();

const getCurrentUser = () =>
    call(function*() {
        let currentUser: GetUserInfo = yield select(
            (state: MainRootState) => state.bdap.currentUser
        );
        if (typeof currentUser === "undefined") {
            const a: ActionType<
                typeof BdapActions.currentUserReceived
            > = yield take(getType(BdapActions.currentUserReceived));
            currentUser = a.payload;
        }
        return currentUser;
    });

function* rpcLinkCommand<T extends Link>(
    rpcClient: RpcClient,
    cmd: (client: RpcClient) => Promise<LinkResponse<T>>,
    successActionCreator: (entries: T[]) => any,
    failActionCreator: (message: string) => any
) {
    let response: LinkResponse<T>;
    try {
        response = yield unlockedCommandEffect(rpcClient, cmd);
    } catch (err) {
        yield put(failActionCreator(err.message));
        return;
    }
    const links = extractLinks<T>(response);
    yield put(successActionCreator(links));
}

function isLinkDeniedResponse(
    obj: LinkDeniedResponse | {}
): obj is LinkDeniedResponse {
    return (<LinkDeniedResponse>obj).list_updated !== undefined;
}

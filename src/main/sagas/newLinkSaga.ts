import { takeEvery, select, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { MainRootState } from "../reducers";
import { fromSingleValue, empty, blinq } from "blinq";
import MapIterable from "blinq/dist/types/src/MapIterable";
import { Enumerable } from "blinq/dist/types/src/Enumerable";

export function* newLinkSaga() {
    let currentCompleteLinks: Link[] = yield select((s: MainRootState) => s.bdap.completeLinks)
    yield takeEvery(getType(BdapActions.getCompleteLinksSuccess), function* (action: ActionType<typeof BdapActions.getCompleteLinksSuccess>) {
        const opsMap = getLinkListDiffMap(action.payload, currentCompleteLinks)
        const newLinks = extractLinkCategories("added", opsMap).toArray()
        currentCompleteLinks = action.payload
        for (const link of newLinks) {
            yield put(BdapActions.newCompleteLink(link))
        }
    })
}

type LinkCategory = "added" | "removed" | "other"

const extractLinkCategories = (category: LinkCategory, opsMap: MapIterable<LinkCategory, Enumerable<Link | undefined>>) =>
    opsMap.has(category)
        ? opsMap
            .get(category)!
            .selectMany(item =>
                typeof item !== "undefined"
                    ? fromSingleValue(item)
                    : empty<Link>())
        : empty<Link>()

const getLinkListDiffMap = (newCompleteLinks: Link[], currentCompleteLinks: Link[]) =>
    blinq(newCompleteLinks)
        .fullOuterJoin(
            currentCompleteLinks || [],
            link => `${link.recipient_fqdn}|${link.requestor_fqdn}`,
            link => `${link.recipient_fqdn}|${link.requestor_fqdn}`,
            (newLink, oldLink) => ({ newLink, oldLink }))
        .toLookup(({ newLink, oldLink }) =>
            newLink && oldLink
                ? "other"
                : newLink
                    ? "added"
                    : oldLink
                        ? "removed"
                        : "other",
            ({ newLink, oldLink }) =>
                newLink && oldLink
                    ? undefined
                    : newLink
                        ? newLink
                        : oldLink
                            ? oldLink
                            : undefined)

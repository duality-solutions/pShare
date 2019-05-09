import { takeLatest, put, take } from "redux-saga/effects";
import { SearchActions } from "../../shared/actions/search";
import { getType, ActionType } from "typesafe-actions";
import { delay } from "redux-saga";
import { PayloadCreator } from "typesafe-actions/dist/types";
import { BdapActions } from "../../shared/actions/bdap";

export function* searchTextDebounceSaga() {
    yield take(getType(BdapActions.bdapDataFetchSuccess))
    yield* debounce(500, SearchActions.addLinksQueryTextChanged, SearchActions.addLinksQueryChanged, s => s.length === 0);
    yield* debounce(500, SearchActions.myLinksQueryTextChanged, SearchActions.myLinksQueryChanged, s => s.length === 0);
}

function* debounce<TIn extends string, TOut extends string, P>(
    debounceMs: number,
    incomingActionCreator: PayloadCreator<TIn, P>,
    outgoingActionCreator: PayloadCreator<TOut, P>,
    bypassPredicate: (item: P) => boolean = () => false
) {
    const t = getType(incomingActionCreator);
    yield takeLatest(
        t,
        function* (action: ActionType<typeof incomingActionCreator>) {
            if (!bypassPredicate(action.payload)) {
                yield delay(debounceMs);

            }
            yield put(outgoingActionCreator(action.payload));
        });
}

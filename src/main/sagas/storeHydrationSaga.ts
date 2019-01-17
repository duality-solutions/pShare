import { put, take, select } from 'redux-saga/effects'
import { actionTypes } from 'redux-localstorage'
import { getType } from 'typesafe-actions';
import RootActions from '../../shared/actions'

export default function* () {
    const hydrateAction = getType(RootActions.hydratePersistedData)

    for (; ;) {

        yield take(hydrateAction);
        const state = yield select();
        yield put({ type: actionTypes.INIT, payload: state })
        yield put(RootActions.appInitialized())

    }
}
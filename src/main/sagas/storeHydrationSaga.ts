import { put, select, takeEvery } from 'redux-saga/effects'
import { actionTypes } from 'redux-localstorage'
import { getType } from 'typesafe-actions';
import { RootActions } from '../../shared/actions'

export function* storeHydrationSaga() {


    yield takeEvery(getType(RootActions.hydratePersistedData), function* () {
        const state = yield select();
        yield put({ type: actionTypes.INIT, payload: state })
        yield put(RootActions.appInitialized())
    })

}
import { takeEvery, select, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkAcceptResponse } from "../../dynamicdInterfaces/LinkAcceptResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
export function* linkAcceptSaga() {


    yield takeEvery(getType(BdapActions.beginAcceptLink), function* ({ payload: { recipient, requestor } }: ActionType<typeof BdapActions.beginAcceptLink>) {
        const action = BdapActions.acceptLink({ recipient, requestor })
        yield put(action)
    })

    yield takeEvery(getType(BdapActions.acceptLink), function* (action: ActionType<typeof BdapActions.acceptLink>) {
        const { payload: { recipient, requestor, registrationDays } } = action;
        const userName: string = yield select((state: MainRootState) => state.user.userName);
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName");
        }
        if (recipient !== userName) {
            throw Error(`recipient marked as ${recipient} but I am ${userName}`);
        }


        let response: LinkAcceptResponse;
        try {
            response =
                yield unlockedCommandEffect(command =>
                    typeof registrationDays === 'undefined'
                        ? command("link", "accept", requestor, recipient)
                        : command("link", "accept", requestor, recipient, registrationDays.toString()));
        } catch (err) {
            debugger
            throw err
        }
        console.log(response)
        yield put(BdapActions.getCompleteLinks())
        yield put(BdapActions.getPendingAcceptLinks())
    });
}

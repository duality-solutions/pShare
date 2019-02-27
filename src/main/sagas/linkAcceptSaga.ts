import { takeEvery, select } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkAcceptResponse } from "../../dynamicdInterfaces/LinkAcceptResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
export function* linkAcceptSaga() {
    yield takeEvery(getType(BdapActions.acceptLink), function* (action: ActionType<typeof BdapActions.acceptLink>) {
        const { payload: { recipient, requestor, registrationDays } } = action;
        const userName: string = yield select((state: MainRootState) => state.user.userName);
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName");
        }
        if (recipient !== userName) {
            throw Error(`recipient marked as ${recipient} but I am ${userName}`);
        }


        // @ts-ignore
        const response: LinkAcceptResponse =
            yield unlockedCommandEffect(command =>
                typeof registrationDays === 'undefined'
                    ? command("link", "accept", requestor, recipient)
                    : command("link", "accept", requestor, recipient, registrationDays));
    });
}

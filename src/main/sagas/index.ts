import { AnyAction, } from "redux";
import { take } from "redux-saga/effects";
import { initializationSaga } from "./initializationSaga";




export const getRootSaga = () => {
    return [loggingSaga, initializationSaga]
}




function* loggingSaga() {
    console.log("starting saga")
    for (; ;) {
        const action: AnyAction = yield take("*");
        console.log("saga action : ", action);
    }

}
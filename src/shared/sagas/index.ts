import { AnyAction, } from "redux";
import { take } from "redux-saga/effects";
import { navSaga } from "./navSaga";
import { initializationSaga } from "./initializationSaga";




export const getMainRootSaga = () => {
    return [loggingSaga, initializationSaga]
}

export const getRendererRootSaga = () => {
    return [navSaga]
}


function* loggingSaga() {
    console.log("starting saga")
    for (; ;) {
        const action: AnyAction = yield take("*");
        console.log("saga action : ", action);
    }

}
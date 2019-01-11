import { AnyAction, } from "redux";
import { take } from "redux-saga/effects";




export const getRootSaga = () => {
    return [ loggingSaga ]
}


function* loggingSaga() {
    console.log("starting saga")
    for (; ;) {
        const action: AnyAction = yield take("*");
        console.log("saga action : ", action.type);
    }

}
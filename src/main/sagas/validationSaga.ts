import { put, takeEvery, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { Action } from "redux";
import OnboardingActions from "../../shared/actions/onboarding";
import delay from "../../shared/system/delay";
export function* validationSaga() {
    yield takeEvery((action: Action<any>) => /^validate\/request\//.test(action.type), function* (action: OnboardingActions) {
        switch (action.type) {
            case getType(OnboardingActions.validateUsername):
                const username = action.payload
                const errors: string[] = yield call(validate, username)

                yield put(OnboardingActions.usernameValidated({ success: errors.length == 0, value: username, errors }));
                break;
        }
    });
}
function isPromise(obj: any) {
    return (typeof obj === 'undefined' ? 'undefined' : typeof (obj)) === 'object' && typeof obj.then === 'function';
}
const isAlphaNumeric = (value: string) => /^[A-Za-z0-9]+$/.test(value)
const isNotEmpty = (value: string) => typeof value !== 'undefined' && value.length > 0
const failsAfterThreeSeconds = (value: string) => delay(3000).then(() => true)

const validationRules = [
    {
        test: isAlphaNumeric,
        message: "value should be alphanumeric"
    },
    {
        test: isNotEmpty,
        message: "value should not be empty"
    }, {
        test: failsAfterThreeSeconds,
        message: "oh no. 3s failure"
    }
]

const validate = async (value: string) => {
    const resolvedTests = await Promise.all(
        validationRules.map(async (rule) => {
            const testResult = rule.test(value)
            const result = (isPromise(testResult) ? await testResult : testResult) as boolean
            return { result, message: rule.message }
        }))
    return resolvedTests.filter(test => !test.result).map(test => test.message)

}
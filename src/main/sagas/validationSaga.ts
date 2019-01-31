import { put, takeEvery, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { Action } from "redux";
import OnboardingActions from "../../shared/actions/onboarding";
import delay from "../../shared/system/delay";
import { blinq } from 'blinq'

export function* validationSaga() {
    yield takeEvery((action: Action<any>) => /^validate\/request\//.test(action.type), function* (action: OnboardingActions) {
        switch (action.type) {
            case getType(OnboardingActions.validateUsername):
                const username = action.payload
                const errors: string[] = yield call(validate(validationRules), username)

                yield put(OnboardingActions.usernameValidated({ success: errors.length == 0, value: username, errors }));
                break;
        }
    });
}
function isPromise(obj: any) {
    return (typeof obj === 'undefined' ? 'undefined' : typeof (obj)) === 'object' && typeof obj.then === 'function';
}
const isAlphaNumeric = (value: string) => /^[A-Za-z0-9]+$/.test(value)
const failsAfterThreeSeconds = (value: string) => delay(3000).then(() => false)

interface ValidationTest<T> {
    test: (value: T) => boolean | Promise<boolean>
    message: string
    testsOnSuccess?: ValidationTest<T>[]
}

const validationRules: ValidationTest<string>[] = [
    {
        test: isAlphaNumeric,
        message: "value should be at least 1 alphanumeric",
        testsOnSuccess: [{
            test: failsAfterThreeSeconds,
            message: "oh no. 3s failure"
        }]
    }

]

interface ValidationTestResult {
    result: boolean
    message: string
}

const runTests = <T>(rules: ValidationTest<T>[]) => async (value: T): Promise<ValidationTestResult[]> => {
    const results = await Promise.all(blinq(rules).select(async (rule) => {
        const testResult = rule.test(value)
        const result = (isPromise(testResult) ? await testResult : testResult) as boolean

        if (result && typeof rule.testsOnSuccess !== 'undefined') {
            return await runTests(rule.testsOnSuccess)(value)
        }
        return [{ result, message: rule.message }]
    }))
    return blinq(results).selectMany(x => x).toArray()
}

const validate = <T>(rules: ValidationTest<T>[]) => async (value: T) => blinq(await runTests(rules)(value)).where(r => !r.result).select(r => r.message).toArray()

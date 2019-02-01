import { blinq } from 'blinq';
import { isPromise } from "../isPromise";
import { ValidationTest } from './ValidationTest';

export const validate =
    <T>(rules: ValidationTest<T>[]) =>
        async (value: T) =>
            blinq(await runTests(rules, value)).where(r => !r.result).select(r => r.message).toArray();

interface ValidationTestResult {
    result: boolean
    message: string
    isError: boolean
}
const runTests = async <T>(rules: ValidationTest<T>[], value: T): Promise<ValidationTestResult[]> => {
    const results = await Promise.all(blinq(rules).select(async (rule) => {
        const testResult = rule.test(value);
        let result: boolean
        let message: string;
        let isError: boolean = false;
        try {
            result = (isPromise(testResult) ? await testResult : testResult) as boolean;
            message = rule.message
        }
        catch (err) {
            result = false;
            message = err.message
            isError = true
        }
        if (result && typeof rule.testsOnSuccess !== 'undefined') {
            return await runTests(rule.testsOnSuccess, value);
        }
        return [{ result, message: message, isError }];
    }));
    return blinq(results).selectMany(x => x).toArray();
};

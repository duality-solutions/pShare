import { blinq } from 'blinq';
import { isPromise } from "../isPromise";
import { ValidationTest } from './ValidationTest';
import { ValidationResult } from './ValidationResult';

export const validate =
    <T>(rules: ValidationTest<T>[]) =>
        async (value: T) => {
            const testResults = await runTests(rules, value);
            const failedTestResults = blinq(testResults).where(r => !r.result);
            const failedValidationMessages = failedTestResults.select(r => r.message).toArray();
            const isError = failedTestResults.any(t => t.isError)
            const result: ValidationResult<T> = {
                isError,
                success: !failedTestResults.any(),
                validationMessages: failedValidationMessages,
                value
            }
            return result
        };

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

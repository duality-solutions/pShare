import { blinq } from 'blinq';
import { isPromise } from "../isPromise";

export const validate =
    <T>(rules: ValidationTest<T>[]) =>
        async (value: T) =>
            blinq(await runTests(rules)(value)).where(r => !r.result).select(r => r.message).toArray();

export interface ValidationTest<T> {
    test: (value: T) => boolean | Promise<boolean>;
    message: string;
    testsOnSuccess?: ValidationTest<T>[];
}
interface ValidationTestResult {
    result: boolean;
    message: string;
}
const runTests = <T>(rules: ValidationTest<T>[]) => async (value: T): Promise<ValidationTestResult[]> => {
    const results = await Promise.all(blinq(rules).select(async (rule) => {
        const testResult = rule.test(value);
        const result = (isPromise(testResult) ? await testResult : testResult) as boolean;
        if (result && typeof rule.testsOnSuccess !== 'undefined') {
            return await runTests(rule.testsOnSuccess)(value);
        }
        return [{ result, message: rule.message }];
    }));
    return blinq(results).selectMany(x => x).toArray();
};

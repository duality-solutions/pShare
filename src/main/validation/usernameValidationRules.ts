import delay from "../../shared/system/delay";
import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isAlphaNumeric = (value: string) => /^[A-Za-z0-9]+$/.test(value);
const failsAfterThreeSeconds = (value: string) => delay(3000).then(() => false);

const usernameValidationRules: ValidationTest<string>[] = [
    {
        test: isAlphaNumeric,
        message: "value should be at least 1 alphanumeric",
        testsOnSuccess: [{
            test: failsAfterThreeSeconds,
            message: "oh no. 3s failure"
        }]
    }
];

export default usernameValidationRules
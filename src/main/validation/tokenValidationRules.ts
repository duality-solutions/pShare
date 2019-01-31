import delay from "../../shared/system/delay";
import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isValidToken = (value: string) => /^[A-Za-z0-9]+$/.test(value);
const mockDynamicdCall = (value: string) => delay(5000).then(() => value !== "fail");

const tokenValidationRules: ValidationTest<string>[] = [
    {
        test: isValidToken,
        message: "value should be at least 1 alphanumeric",
        testsOnSuccess: [{
            test: mockDynamicdCall,
            message: "oh no. something bad."
        }]
    }
];

export default tokenValidationRules
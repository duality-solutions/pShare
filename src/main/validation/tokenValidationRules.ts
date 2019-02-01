import delay from "../../shared/system/delay";
import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isValidToken = (value: string) => /^[A-Za-z0-9]{6,}$/.test(value);
const mockDynamicdCall = (value: string) => delay(5000).then(() => value !== "fail");

const tokenValidationRules: ValidationTest<string>[] = [
    {
        test: isValidToken,
        message: "you need to fill all the 6 characters",
        testsOnSuccess: [{
            test: mockDynamicdCall,
            message: "oh no. something bad."
        }]
    }
];

export default tokenValidationRules
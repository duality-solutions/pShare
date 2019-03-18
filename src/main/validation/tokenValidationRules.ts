//import delay from "../../shared/system/delay";
import { ValidationTest } from "../../shared/system/validator/ValidationTest";
import { RpcClient } from "../RpcClient";

const isValidToken = (rpcClient:RpcClient,value: string) => /^[A-Za-z0-9]{6,}$/.test(value);
//const mockDynamicdCall = (value: string) => delay(2000).then(() => value !== "zzzzzz");

export const tokenValidationRules: ValidationTest<string>[] = [
    {
        test: isValidToken,
        message: "6 letter/number characters are required for the token",
        // testsOnSuccess: [{
        //     test: mockDynamicdCall,
        //     message: "oh no. something bad."
        // }]
    }
];


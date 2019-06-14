import { ValidationTest } from "../../shared/system/validator/ValidationTest";
import { RpcClient } from "../RpcClient";

const isValidCommonName = (rpcClient:RpcClient,value: string) => /^[A-Za-z0-9]+$/.test(value);

export const commonNameValidationRules: ValidationTest<string>[] = [
    {
        test: isValidCommonName,
        message: "Value may only contain letters and numbers.",

    }
];


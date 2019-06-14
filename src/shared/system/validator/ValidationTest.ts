import { RpcClient } from "../../../main/RpcClient";

export interface ValidationTest<T> {
    test: (client:RpcClient,value: T) => boolean | Promise<boolean>;
    message: string;
    testsOnSuccess?: ValidationTest<T>[];
}

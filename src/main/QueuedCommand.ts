import { PromiseResolver } from "../shared/system/PromiseResolver";
import { RpcClient } from "./RpcClient";
export interface QueuedCommand {
    action: (client: RpcClient) => Promise<any>;
    promiseResolver: PromiseResolver<any>;
}

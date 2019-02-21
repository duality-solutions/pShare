import { RpcCommandFunc } from "./RpcCommandFunc";
import { PromiseResolver } from "../shared/system/PromiseResolver";
export interface QueuedCommand {
    action: (command: RpcCommandFunc) => Promise<any>;
    promiseResolver: PromiseResolver<any>;
}

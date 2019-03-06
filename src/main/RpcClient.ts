import { RpcCommandFunc } from './RpcCommandFunc';
import { DynamicdProcessInfo } from './dynamicd/DynamicdProcessInfo';
export interface RpcClient {
    command: RpcCommandFunc;
    //cancel: () => void
    dispose: () => void
}

export interface RpcClientWrapper extends RpcClient {
    processInfo: DynamicdProcessInfo

}

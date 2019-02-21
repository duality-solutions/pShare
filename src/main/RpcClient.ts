import { RpcCommandFunc } from './RpcCommandFunc';
export interface RpcClient {
    command: RpcCommandFunc;
    //cancel: () => void
    dispose: () => void
}

import { DynamicdProcessInfo } from './dynamicd/DynamicdProcessInfo';
import { RpcCommandOptions } from './system/jsonRpc/RpcCommandOptions';
export interface RpcClient {
    command<TT>(rpcCommand: string, ...args: any): Promise<TT>
    command<TT>(options: RpcCommandOptions, rpcCommand: string, ...args: any): Promise<TT>
    //cancel: () => void
    //dispose: () => void
}

export interface RpcClientWrapper extends RpcClient {
    processInfo: DynamicdProcessInfo

}

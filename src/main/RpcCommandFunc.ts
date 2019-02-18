export type RpcCommandFunc = <TT>(rpcCommand: string, ...args: any) => Promise<TT>;

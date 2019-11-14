import { startDynamicd } from './dynamicd/startDynamicd';
import { delay } from '../shared/system/delay';
import { RpcClient, RpcClientWrapper } from './RpcClient';
import { CancellationToken } from '../shared/system/createCancellationTokenSource';
import { DynamicdProcessInfo } from './dynamicd/DynamicdProcessInfo';
import JsonRpcClient, { RpcClientOptions } from './system/jsonRpc/JsonRpcClient';
import { RpcCommandOptions } from './system/jsonRpc/RpcCommandOptions';
import { asyncFuncWithMaxdop } from '../shared/system/asyncFuncWithMaxdop';

const isDevelopment = process.env.NODE_ENV === 'development'


let rpcClientPromise: Promise<RpcClientWrapper>

export function getRpcClient(cancellationToken: CancellationToken) {
    if (typeof rpcClientPromise === 'undefined') {
        rpcClientPromise = createQueuedRpcClient(cancellationToken)
    }
    return rpcClientPromise
}

async function createQueuedRpcClient(masterCancellationToken: CancellationToken): Promise<RpcClientWrapper> {
    const cancellationTokenSource = masterCancellationToken.createLinkedTokenSource()
    const cancellationToken = cancellationTokenSource.getToken()
    const { client: rpcClient, processInfo } = await createRpcClient(cancellationToken);
    const queuedCommand = asyncFuncWithMaxdop(rpcClient.command)
    return {
        command<T>(methodOrOptions: string | RpcCommandOptions, ...params: any[]) {
            const options = typeof methodOrOptions === "string" ? {} : methodOrOptions
            const method = typeof methodOrOptions === "string" ? methodOrOptions : params[0]
            const args = typeof methodOrOptions === "string" ? params : params.slice(1)
            return queuedCommand(options, method, ...args)
        },
        processInfo
    }
}

async function createRpcClient(cancellationToken: CancellationToken): Promise<{ client: RpcClient, processInfo: DynamicdProcessInfo }> {
    const processInfo = await startDynamicd(cancellationToken);

    const client = await createJsonRpcClient({
        host: "localhost",
        port: "33350",
        username: processInfo.rpcUser,
        password: processInfo.rpcPassword,
        timeout: 20000,
        retry: { retries: 4 }
    }, cancellationToken);

    return { client, processInfo }
}
async function createJsonRpcClient(opts: RpcClientOptions, cancellationToken: CancellationToken): Promise<RpcClient> {
    const client = new JsonRpcClient(opts, cancellationToken)
    let errorMessageShown = false;
    //try every 2s until we get a non-error
    for (; ;) {
        try {
            await client.command({ timeout: 5000 }, "getinfo");
            break;
        }
        catch (err) {
            //console.error(err);
            if (!errorMessageShown) {
                console.error(isDevelopment ?
                    "error when attempting rpc call, will try again every 2s until success. did you start dynamicd in docker?" :
                    "error when attempting rpc call, will try again every 2s until success.")
                errorMessageShown = true;
            }
            await delay(2000);
            continue;
        }
    }
    console.log("rpc call successful. client is ready")
    //client is ready to be used
    return {
        command(methodOrOptions: string | RpcCommandOptions, ...params: any[]) {
            const options = typeof methodOrOptions === "string" ? {} : methodOrOptions
            const method = typeof methodOrOptions === "string" ? methodOrOptions : params[0]
            const args = typeof methodOrOptions === "string" ? params : params.slice(1)
            return client.command(options, method, ...args)
        }
        //cancel: () => { },
        //dispose: () => { }
    }
}


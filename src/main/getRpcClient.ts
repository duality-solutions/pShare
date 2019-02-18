import { app } from 'electron';
import { startDynamicd } from './dynamicd/startDynamicd';
import BitcoinClient from 'bitcoin-core';
import { delay } from '../shared/system/delay';
import { RpcClient } from './RpcClient';
import { createAsyncQueue } from '../shared/system/createAsyncQueue';
import { QueuedCommand } from './QueuedCommand';
import { createPromiseResolver } from '../shared/system/createPromiseResolver';
import { createCancellationToken } from '../shared/system/createCancellationToken';

const isDevelopment = process.env.NODE_ENV === 'development'

interface BitcoinClientOptions {
    host: string,
    port: string,
    username: string,
    password: string
}

let rpcClientPromise: Promise<RpcClient>

export function getRpcClient() {
    if (typeof rpcClientPromise === 'undefined') {
        rpcClientPromise = createQueuedRpcClient()
    }
    return rpcClientPromise
}

async function createQueuedRpcClient(): Promise<RpcClient> {
    const cancellationToken = createCancellationToken()
    const bb = createAsyncQueue<QueuedCommand>();
    const rpcClient = await createRpcClient();
    (async () => {
        while (!cancellationToken.isCancellationRequested) {

            let qc: QueuedCommand;
            try {
                qc = await bb.receive(cancellationToken)
            } catch (err) {
                if (cancellationToken.isCancellationRequested) {
                    break
                }
                else {
                    throw err
                }
            }
            const { action, promiseResolver: { resolve, reject } } = qc
            try {
                resolve(action(rpcClient.command))
            }
            catch (err) {
                reject(err)
            }

        }
        console.log("QueuedRpcClient cancelled")
    })()
    return {
        command: <T>(command: string, ...args: any[]): Promise<T> => {
            const promiseResolver = createPromiseResolver<T>()
            bb.post({ action: cmd => cmd(command, ...args), promiseResolver });
            return promiseResolver.promise
        },
        cancel: () => cancellationToken.cancel()
    }
}

async function createRpcClient(): Promise<RpcClient> {
    const processInfo = await startDynamicd();
    app.on('before-quit', async () => {
        //console.log("before quit");
        processInfo.dispose();
        console.log("dynamicd processInfo disposed");
    });
    const client = await createBitcoinCoreClient({
        host: "localhost",
        port: "33650",
        username: processInfo.rpcUser,
        password: processInfo.rpcPassword
    });
    return client
}
async function createBitcoinCoreClient(opts: BitcoinClientOptions): Promise<RpcClient> {
    const client = new BitcoinClient(opts);
    let errorMessageShown = false;
    //try every 2s until we get a non-error
    for (; ;) {
        try {
            await client.command("getinfo");
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
        command: (command: string, ...args: any[]) => client.command(command, ...args),
        cancel: () => { }
    }
}


//import { getRpcClient } from "../../../../getRpcClient";
import { LockedCommandQueueRunner } from "./LockedCommandQueueRunner";
import { runQueuedCommand } from "./runQueuedCommand";
import { unlockWallet } from "./unlockWallet";
import { lockWallet } from "./lockWallet";
import { createAsyncQueue } from "../../../../../shared/system/createAsyncQueue";
import { createCancellationTokenSource } from "../../../../../shared/system/createCancellationTokenSource";
import { QueuedCommandWithPassword } from "./QueuedCommandWithPassword";
import { createPromiseResolver } from "../../../../../shared/system/createPromiseResolver";
import { RpcClient } from "../../../../../main/RpcClient";

const createQueueRunner = async (rpcClient: RpcClient): Promise<LockedCommandQueueRunner> => {
    let queueControls = await getQueueControls(rpcClient)
    return {
        addQueuedCommand: (queuedCommand: QueuedCommandWithPassword) => {
            queueControls.commandQueue.post(queuedCommand);

        },
        cancel: () => queueControls.cancel(),
        get finished() { return queueControls.finishedResolver.promise },
        restart: async () => {
            if (!queueControls.finishedResolver.complete) {
                throw Error("cannot restart unless cancelled first")
            }
            queueControls = await getQueueControls(rpcClient)
        }

    };
};

let queueRunnerProm: Promise<LockedCommandQueueRunner>


export const getLockedCommandQueue = async (rpcClient: RpcClient) => {
    if (typeof queueRunnerProm === 'undefined') {
        queueRunnerProm = createQueueRunner(rpcClient)
    }
    return await queueRunnerProm;
}
async function getQueueControls(rpcClient: RpcClient) {
    console.log("gqc")
    const cancellationTokenSource = createCancellationTokenSource();
    const cancellationToken = cancellationTokenSource.getToken()
    cancellationToken.register(() => console.log("queueControls cancelled"))
    const commandQueue = createAsyncQueue<QueuedCommandWithPassword>();

    //const rpcCommandFunc: RpcCommandFunc = (rpcCommand, ...args) => rpcClient.command(rpcCommand, ...args);
    const finishedResolver = createPromiseResolver<void>();
    const runQueue = async () => {
        while (!cancellationToken.isCancellationRequested) {
            let queuedCommand: QueuedCommandWithPassword;
            try {
                queuedCommand = await commandQueue.receive(cancellationToken);
            }
            catch (err) {
                if (cancellationToken.isCancellationRequested) {
                    break;
                }
                throw err;
            }
            let didTimeout = false;
            while (!didTimeout && !cancellationToken.isCancellationRequested) {
                const pw = queuedCommand.password;
                let currentPassword: string = pw;
                try {
                    await unlockWallet(rpcClient, pw);
                }
                catch (err) {
                    queuedCommand.promiseResolver.reject(err);
                    break;
                }
                try {
                    await runQueuedCommand(rpcClient, queuedCommand);
                    while (!cancellationToken.isCancellationRequested) {
                        const localCancTokSrc = cancellationToken.createLinkedTokenSource(10000);
                        const tok = localCancTokSrc.getToken();
                        try {
                            queuedCommand = await commandQueue.receive(tok);
                        }
                        catch (err) {
                            if (tok.isCancellationRequested) {
                                if (cancellationToken.isCancellationRequested) {
                                    console.warn("locked command queue cancelled");
                                }
                                didTimeout = true;
                                break;
                            }
                            else {
                                throw err;
                            }
                        }
                        if (queuedCommand.password !== currentPassword) {
                            break;
                        }
                        await runQueuedCommand(rpcClient, queuedCommand);
                    }
                }
                catch (err) {
                    throw err;
                }
                finally {
                    await lockWallet(rpcClient);
                }
            }
        }
        finishedResolver.resolve();
    };
    runQueue();
    return { finishedResolver, commandQueue, cancel: () => cancellationTokenSource.cancel() };
}


//import { getRpcClient } from "../../../../getRpcClient";
import { RpcCommandFunc } from "../../../../RpcCommandFunc";
import { LockedCommandQueueRunner } from "./LockedCommandQueueRunner";
import { runQueuedCommand } from "./runQueuedCommand";
import { unlockWallet } from "./unlockWallet";
import { lockWallet } from "./lockWallet";
import { createAsyncQueue } from "../../../../../shared/system/createAsyncQueue";
import { createCancellationToken } from "../../../../../shared/system/createCancellationToken";
import { QueuedCommandWithPassword } from "./QueuedCommandWithPassword";
import { createPromiseResolver } from "../../../../../shared/system/createPromiseResolver";
import { RpcClient } from "../../../../../main/RpcClient";

const createQueueRunner = async (rpcClient: RpcClient): Promise<LockedCommandQueueRunner> => {
    let queueControls = await getQueueControls(rpcClient)
    return {
        addQueuedCommand: (queuedCommand: QueuedCommandWithPassword) => {
            queueControls.commandQueue.post(queuedCommand);

        },
        cancel: () => queueControls.cancellationToken.cancel(),
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
    const cancellationToken = createCancellationToken();
    cancellationToken.register(()=>console.log("queueControls cancelled"))
    const commandQueue = createAsyncQueue<QueuedCommandWithPassword>();

    const rpcCommandFunc: RpcCommandFunc = (rpcCommand, ...args) => rpcClient.command(rpcCommand, ...args);
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
                    await unlockWallet(rpcCommandFunc, pw);
                }
                catch (err) {
                    queuedCommand.promiseResolver.reject(err);
                    break;
                }
                try {
                    await runQueuedCommand(rpcCommandFunc, queuedCommand);
                    while (!cancellationToken.isCancellationRequested) {
                        const localCancTok = cancellationToken.createDependentToken(10000);
                        try {
                            queuedCommand = await commandQueue.receive(localCancTok);
                        }
                        catch (err) {
                            if (localCancTok.isCancellationRequested) {
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
                        await runQueuedCommand(rpcCommandFunc, queuedCommand);
                    }
                }
                catch (err) {
                    throw err;
                }
                finally {
                    await lockWallet(rpcCommandFunc);
                }
            }
        }
        finishedResolver.resolve();
    };
    runQueue();
    return { finishedResolver, commandQueue, cancellationToken };
}


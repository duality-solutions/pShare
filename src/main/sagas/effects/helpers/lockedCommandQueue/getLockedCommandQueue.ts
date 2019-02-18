import { getRpcClient } from "../../../../getRpcClient";
import { RpcCommandFunc } from "../../../../RpcCommandFunc";
import { LockedCommandQueueRunner } from "./LockedCommandQueueRunner";
import { runQueuedCommand } from "./runQueuedCommand";
import { unlockWallet } from "./unlockWallet";
import { lockWallet } from "./lockWallet";
import { createAsyncQueue } from "../../../../../shared/system/createAsyncQueue";
import { createCancellationToken } from "../../../../../shared/system/createCancellationToken";
import { QueuedCommandWithPassword } from "./QueuedCommandWithPassword";
import { createPromiseResolver } from "../../../../../shared/system/createPromiseResolver";

const createQueueRunner = async (): Promise<LockedCommandQueueRunner> => {
    const cancellationToken = createCancellationToken()
    const commandQueue = createAsyncQueue<QueuedCommandWithPassword>();
    const rpcClient = await getRpcClient();
    const rpcCommandFunc: RpcCommandFunc = (rpcCommand, ...args) => rpcClient.command(rpcCommand, ...args);
    const finishedResolver = createPromiseResolver<void>()
    const runQueue = async () => {
        while (!cancellationToken.isCancellationRequested) {
            //let lockedSessionIsValid = true;
            let queuedCommand: QueuedCommandWithPassword;
            try {
                queuedCommand = await commandQueue.receive(cancellationToken)

            } catch (err) {
                if (cancellationToken.isCancellationRequested) {
                    break;
                }
                throw err
            }
            let didTimeout = false;
            while (!didTimeout && !cancellationToken.isCancellationRequested) {
                const pw = queuedCommand.password
                let currentPassword: string = pw;
                try {
                    await unlockWallet(rpcCommandFunc, pw);

                }
                catch (err) {
                    queuedCommand.promiseResolver.reject(err)
                    console.log("pw is invalid")
                    break
                }

                try {
                    await runQueuedCommand(rpcCommandFunc, queuedCommand);
                    while (!cancellationToken.isCancellationRequested) {

                        const localCancTok = cancellationToken.createDependentToken(10000);
                        try {
                            queuedCommand = await commandQueue.receive(localCancTok)
                        } catch (err) {
                            if (localCancTok.isCancellationRequested) {
                                if (cancellationToken.isCancellationRequested) {
                                    console.warn("locked command queue cancelled")
                                }
                                else {
                                    console.log("timeout waiting for queue")
                                }

                                didTimeout = true
                                break
                            }
                            else {
                                throw err
                            }
                        }
                        if (queuedCommand.password !== currentPassword) {
                            break
                        }
                        await runQueuedCommand(rpcCommandFunc, queuedCommand);
                    }
                }
                catch (err) {

                    throw err
                }
                finally {
                    await lockWallet(rpcCommandFunc);

                }
            }


        }

        finishedResolver.resolve()



    };
    runQueue();
    return {
        addQueuedCommand: (queuedCommand: QueuedCommandWithPassword) => {
            commandQueue.post(queuedCommand);

        },
        cancel: () => cancellationToken.cancel(),
        finished: finishedResolver.promise

    };
};

let queueRunnerProm: Promise<LockedCommandQueueRunner>


export const getLockedCommandQueue = async () => {
    if (typeof queueRunnerProm === 'undefined') {
        queueRunnerProm = createQueueRunner()
    }
    return await queueRunnerProm;
}

import { lazy } from "../../../../../shared/system/lazy";
import { getRpcClient } from "../../../../getRpcClient";
import { RpcCommandFunc } from "../../../../RpcCommandFunc";
import { LockedCommandQueueRunner } from "./LockedCommandQueueRunner";
import { runQueuedCommand } from "./runQueuedCommand";
import { unlockWallet } from "./unlockWallet";
import { lockWallet } from "./lockWallet";
import { createAsyncQueue } from "../../../../../shared/system/createAsyncQueue";
import { createCancellationToken } from "../../../../../shared/system/createCancellationToken";
import { QueuedCommandWithPassword } from "./QueuedCommandWithPassword";

const createQueueRunner = async (): Promise<LockedCommandQueueRunner> => {
    const commandQueue = createAsyncQueue<QueuedCommandWithPassword>();
    const bitcoinClient = await getRpcClient();
    const bitcoinCommand: RpcCommandFunc = (rpcCommand, ...args) => bitcoinClient.command(rpcCommand, ...args);
    let running = false;
    const runQueue = async () => {
        if (running) {
            return;
        }
        running = true
        try {
            for (; ;) {
                //let lockedSessionIsValid = true;
                let queuedCommand: QueuedCommandWithPassword = await commandQueue.receive()
                let didTimeout = false;
                while (!didTimeout) {
                    const pw = queuedCommand.password
                    let currentPassword: string = pw;
                    try {
                        await unlockWallet(bitcoinCommand, pw);

                    }
                    catch (err) {
                        queuedCommand.promiseResolver.reject(err)
                        console.log("pw is invalid")
                        break
                    }

                    try {
                        await runQueuedCommand(bitcoinCommand, queuedCommand);
                        for (; ;) {

                            try {
                                queuedCommand = await commandQueue.receive(createCancellationToken(2000))
                            } catch (err) {
                                if (/^cancelled$/.test(err.message)) {
                                    console.log("timeout waiting for queue")
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
                            await runQueuedCommand(bitcoinCommand, queuedCommand);
                        }
                    }
                    catch (err) {

                        throw err
                    }
                    finally {
                        await lockWallet(bitcoinCommand);

                    }
                }


            }

        } finally {
            running = false;
        }



    };
    return {
        addQueuedCommand: (queuedCommand: QueuedCommandWithPassword) => {
            commandQueue.post(queuedCommand);
            runQueue();
        }
    };
};

const queueRunnerLazy = lazy(() => createQueueRunner());


export const getLockedCommandQueue = () => queueRunnerLazy.get();

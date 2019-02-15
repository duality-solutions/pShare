import { lazy } from "../../../../../shared/system/lazy";
import { getBitcoinClient } from "../../../../getBitcoinClient";
import { RpcCommandFunc } from "../RpcCommandFunc";
import { QueuedCommand } from "./QueuedCommand";
import { LockedCommandQueueRunner } from "./LockedCommandQueueRunner";
import { runQueuedCommand } from "./runQueuedCommand";
import { unlockWallet } from "./unlockWallet";
import { lockWallet } from "./lockWallet";

const createQueueRunner = async (): Promise<LockedCommandQueueRunner> => {
    const commandQueue: QueuedCommand[] = [];
    let unlocked = false;
    const bitcoinClient = await getBitcoinClient();
    const bitcoinCommand: RpcCommandFunc = (rpcCommand, ...args) => bitcoinClient.command(rpcCommand, ...args);
    const runQueue = async (walletPassphrase: string) => {
        if (unlocked) {
            return;
        }
        console.log("command queue starting");
        unlocked = true;
        while (commandQueue.length > 0) {
            await unlockWallet(bitcoinCommand, walletPassphrase);
            try {
                let queuedCommand: QueuedCommand | undefined;
                while (typeof (queuedCommand = commandQueue.shift()) !== 'undefined') {
                    await runQueuedCommand(bitcoinCommand, queuedCommand);
                }
            }
            finally {
                await lockWallet(bitcoinCommand);
            }
        }
        console.log("command queue stopping");
        unlocked = false;
    };
    return {
        addQueuedCommand: (walletPassphrase: string, queuedCommand: QueuedCommand) => {
            commandQueue.push(queuedCommand);
            runQueue(walletPassphrase);
        }
    };
};

const queueRunnerLazy = lazy(() => createQueueRunner());


export const getLockedCommandQueue = () => queueRunnerLazy.get();

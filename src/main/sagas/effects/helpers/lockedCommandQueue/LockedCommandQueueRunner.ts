import { QueuedCommand } from "./QueuedCommand";
export interface LockedCommandQueueRunner {
    addQueuedCommand: (walletPassphrase: string, queuedCommand: QueuedCommand) => void;
}

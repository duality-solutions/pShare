import { QueuedCommandWithPassword } from "./QueuedCommandWithPassword";
export interface LockedCommandQueueRunner {
    addQueuedCommand: (queuedCommand: QueuedCommandWithPassword) => void;
    cancel:()=>void
    finished:Promise<void>
}

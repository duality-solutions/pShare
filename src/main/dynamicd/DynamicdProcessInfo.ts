import { EventEmitterBase } from "../../shared/system/events/EventEmitterBase";

export interface DynamicdProcessInfo extends EventEmitterBase{
    start(): void;
    //dispose(): Promise<void>;
    rpcUser: string;
    rpcPassword: string;
}

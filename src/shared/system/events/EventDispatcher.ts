import { EventEmitterBase } from "./EventEmitterBase";

export interface EventDispatcher extends EventEmitterBase {
    dispatchEvent: (evtName: string, evtObj: any) => void;
}



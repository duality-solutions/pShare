import { EventEmitterBase } from "./EventEmitterBase";

export interface EventDispatcher<T extends string=string> extends EventEmitterBase<T> {
    dispatchEvent: (evtName: T, evtObj: any) => void;
}



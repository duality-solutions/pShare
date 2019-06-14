export interface EventEmitterBase<T extends string=string> {
    addEventListener: (evtName: T, handler: (evtObj: any) => void) => boolean;
    once: (evtName: T, handler: (evtObj: any) => void) => boolean;
    removeEventListener: (evtName: T, handler: (evtObj: any) => void) => boolean;

}
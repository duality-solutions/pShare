export interface EventEmitterBase{
    addEventListener: (evtName: string, handler: (evtObj: any) => void) => boolean;
    removeEventListener: (evtName: string, handler: (evtObj: any) => void) => boolean;

}
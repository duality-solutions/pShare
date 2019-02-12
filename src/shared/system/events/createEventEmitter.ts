import { EventDispatcher } from "./EventDispatcher";
export function createEventEmitter() {
    const listeners: Map<string, Set<((evtObj: any) => void)>> = new Map<string, Set<((evtObj: any) => void)>>();
    const dispatchEvent = (evtName: string, evtObj: any) => {
        const handlers = listeners.get(evtName);
        if (handlers) {
            [...handlers.values()].forEach(h => h(evtObj));
        }
    };
    const removeEventListener = (evtName: string, handler: (evtObj: any) => void) => {
        if (!listeners.has(evtName)) {
            return false;
        }
        const listenersSet = listeners.get(evtName);
        return listenersSet ? listenersSet.delete(handler) : false;
    };
    const addEventListener = (evtName: string, handler: (evtObj: any) => void) => {
        if (!listeners.has(evtName)) {
            listeners.set(evtName, new Set());
        }
        const listenersSet = listeners.get(evtName);
        if (listenersSet) {
            if (!listenersSet.has(handler)) {
                listenersSet.add(handler);
                return true;
            }
        }
        return false;
    };
    const em: EventDispatcher = {
        dispatchEvent,
        addEventListener,
        removeEventListener
    };
    return em;
}

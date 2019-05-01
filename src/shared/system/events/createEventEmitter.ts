import { EventDispatcher } from "./EventDispatcher";
export function createEventEmitter<T extends string = string>() {
    const listeners: Map<T, Set<((evtObj: any) => void)>> = new Map<T, Set<((evtObj: any) => void)>>();
    const dispatchEvent = (evtName: T, evtObj: any) => {
        const handlers = listeners.get(evtName);
        if (handlers) {
            [...handlers.values()].forEach(h => h(evtObj));
        }
    };
    const removeEventListener = (evtName: T, handler: (evtObj: any) => void) => {
        if (!listeners.has(evtName)) {
            return false;
        }
        const listenersSet = listeners.get(evtName);
        return listenersSet ? listenersSet.delete(handler) : false;
    };
    const addEventListener = (evtName: T, handler: (evtObj: any) => void) => {
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
    const once = (evtName: T, handler: (evtObj: any) => void) => {
        const h = (evtObj: any) => {
            handler(evtObj)
            removeEventListener(evtName, h)
        }
        return addEventListener(evtName, h)
    }
    const em: EventDispatcher<T> = {
        dispatchEvent,
        addEventListener,
        once,
        removeEventListener
    };
    return em;
}

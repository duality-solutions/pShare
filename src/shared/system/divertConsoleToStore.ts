import { Store } from 'redux';
import { AppActions } from '../actions/app';
import { prepareErrorForSerialization } from '../proxy/prepareErrorForSerialization';
export function divertConsoleToStore(store: Store, source: string) {
    const originalConsoleLog = console.log.bind(console);
    const originalConsoleWarn = console.warn.bind(console);
    const originalConsoleInfo = console.info.bind(console);
    const originalConsoleError = console.error.bind(console);
    console.log = (...args: any) => {
        store.dispatch(AppActions.log({ level: "log", args: [source, ...args] }));
        originalConsoleLog(...args);
    };
    console.warn = (...args: any) => {
        store.dispatch(AppActions.log({ level: "warn", args: [source, ...args] }));
        originalConsoleWarn(...args);
    };
    console.info = (...args: any) => {
        store.dispatch(AppActions.log({ level: "info", args: [source, ...args] }));
        originalConsoleInfo(...args);
    };
    console.error = (...args: any) => {
        store.dispatch(AppActions.log({ level: "error", args: [source, ...args] }));
        originalConsoleError(...args);
    };
    window.onerror = (err) => {
        const e = prepareErrorForSerialization(err);
        store.dispatch(AppActions.log({ level: "error", args: [source, e] }));
        originalConsoleError(JSON.stringify(e));
    };
}

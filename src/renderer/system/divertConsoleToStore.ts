import { Store } from 'redux';
import { AppActions } from '../../shared/actions/app';
import { prepareErrorForSerialization } from '../../shared/proxy/prepareErrorForSerialization';
export function divertConsoleToStore(store: Store) {
    const originalConsoleLog = console.log.bind(console);
    const originalConsoleWarn = console.warn.bind(console);
    const originalConsoleInfo = console.info.bind(console);
    const originalConsoleError = console.error.bind(console);
    console.log = (...args: any) => {
        store.dispatch(AppActions.log({ level: "log", args }));
        originalConsoleLog(...args);
    };
    console.warn = (...args: any) => {
        store.dispatch(AppActions.log({ level: "warn", args }));
        originalConsoleWarn(...args);
    };
    console.info = (...args: any) => {
        store.dispatch(AppActions.log({ level: "info", args }));
        originalConsoleInfo(...args);
    };
    console.error = (...args: any) => {
        store.dispatch(AppActions.log({ level: "error", args }));
        originalConsoleError(...args);
    };
    window.onerror = (err) => {
        const e = prepareErrorForSerialization(err);
        store.dispatch(AppActions.log({ level: "error", args: [e] }));
        originalConsoleError(JSON.stringify(e));
    };
}

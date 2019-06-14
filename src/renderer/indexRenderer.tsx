import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory, History } from 'history';
import { App } from './components/App';
import { RootActions } from '../shared/actions';
import { divertConsoleToStore } from '../shared/system/divertConsoleToStore';
import { entries } from '../shared/system/entries';
import { AppActions } from '../shared/actions/app';
import { remote, MessageBoxOptions } from 'electron';
import { delay } from '../shared/system/delay';

const dialog = remote.dialog

export function indexRenderer() {


    const rootEl = document.getElementById("app");
    const history: History = createMemoryHistory();
    const store = configureStore(history)
    addUnloadHandler(store);
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (!isDevelopment) {
        divertConsoleToStore(store, "renderer")
    }


    //store.subscribe(() => console.log("renderer store changed : ", store.getState()))
    store.dispatch(RootActions.initializeApp())




    let render = () => ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>

                <App />
            </ConnectedRouter>
        </Provider>,
        rootEl);

    if (isDevelopment && module.hot) {
        module.hot.accept("./components/App", () => {
            console.info("hot-reloading react components")
            render();
            console.warn("react components reloaded");
        });
    }
    render();
}

function addUnloadHandler(store: ReturnType<typeof configureStore>) {
    window.onbeforeunload = e => {
        e.returnValue = false;
        delay(0).then(() => {
            const currentSessions = store.getState().clientDownloads.currentSessions;
            if (entries(currentSessions).any()) {
                const messageBoxOptions: MessageBoxOptions = {
                    type: "warning",
                    title: "Close window",
                    message: "Are you sure?",
                    detail: "There are still users downloading files from you",
                    normalizeAccessKeys: true,
                    buttons: ["&Quit Application", "&Show Me"],
                    noLink: true,
                    cancelId: 1,
                    defaultId: 1
                };
                dialog.showMessageBox(remote.getCurrentWindow(), messageBoxOptions, (res, checked) => {
                    const shouldShutdown = res === 0;
                    if (!shouldShutdown) {
                        store.dispatch(AppActions.shutdownAborted());
                        return;
                    }
                    remote.getCurrentWindow().destroy();
                });
            }
            else {
                remote.getCurrentWindow().destroy();
            }
        });
    };
}

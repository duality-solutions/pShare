import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory, History } from 'history';
import { App } from './components/App';
import { RootActions } from '../shared/actions';
import { divertConsoleToStore } from './system/divertConsoleToStore';

const rootEl = document.getElementById("app");
const history: History = createMemoryHistory();
const store = configureStore(history)

divertConsoleToStore(store)

setTimeout(() => { throw Error("monkey") }, 5000)

//store.subscribe(() => console.log("renderer store changed : ", store.getState()))
store.dispatch(RootActions.initializeApp())




let render = () => ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    rootEl);

const isDevelopment = process.env.NODE_ENV === 'development'
if (isDevelopment && module.hot) {
    module.hot.accept("./components/App", () => {
        console.info("hot-reloading react components")
        render();
        console.warn("react components reloaded");
    });
}
render();
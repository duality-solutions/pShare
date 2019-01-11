import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from '../shared/store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory, History } from 'history';
import { App } from './components/App';

const rootEl = document.getElementById("app");
const history: History = createMemoryHistory();
const store = configureStore("renderer", history)

let render = () => ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    rootEl);

if (module.hot) {
    module.hot.accept("./components/App", () => {
        console.info("hot-reloading react components")
        render();
        console.warn("react components reloaded");
    });
}
render();
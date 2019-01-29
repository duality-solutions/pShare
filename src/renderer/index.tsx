import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory, History } from 'history';
import { App } from './components/App';
import RootActions from '../shared/actions';
import getProxyForChannel from '../shared/proxy/getProxyForChannel';
import { ValidationApi } from '../shared/validation/ValidationApi';

const rootEl = document.getElementById("app");
const history: History = createMemoryHistory();
const store = configureStore(history)
//store.subscribe(() => console.log("renderer store changed : ", store.getState()))
store.dispatch(RootActions.initializeApp())

const validator = getProxyForChannel<ValidationApi>("validationApi");

(async () => {
    try {
        const isValid = await validator.validate("foo")
        console.log(`validator.validate returned ${isValid}`)
    } catch (err) {
        console.log("oh no ", err)
    }
})()




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
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export const composeEnhancers =
    composeWithDevTools({
        shouldHotReload: false
    })

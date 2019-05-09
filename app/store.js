import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

// reducers
import reducers from './reducers';

const middleware = [thunk];
// noinspection JSUnresolvedVariable
const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })) || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));

export default store;
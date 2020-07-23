import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from "redux-thunk";
import {workerReducer} from './reducers/worker';
//import { composeWithDevTools } from 'redux-devtools-extension';
import {placerReducer} from "./reducers/placer";
const rootReducer = combineReducers({
    worker: workerReducer,
    placer: placerReducer
});
// const composeEnhancers = composeWithDevTools({});
//
// export default createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
export default createStore(rootReducer, applyMiddleware(thunk));

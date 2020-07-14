import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from "redux-thunk";
import {workerReducer} from './reducers/worker';
import { composeWithDevTools } from 'redux-devtools-extension';
const rootReducer = combineReducers({
    worker: workerReducer
});
const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});
export default createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

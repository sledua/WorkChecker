import {createStore, combineReducers} from 'redux';
import {workerReducer} from './reducers/worker'
const rootReducer = combineReducers({
    worker: workerReducer
});

export default createStore(rootReducer);

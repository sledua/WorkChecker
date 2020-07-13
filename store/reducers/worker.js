import USERS from '../../data/data';
import {UPDATE_STATUS, CREATE_USER} from "../actions/worker";

const initialState = {
    usersAdmin: USERS,
    usersWorker: USERS.filter(rf => rf.rol === 'user'),

};


export const workerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATUS:
            const users = state.usersAdmin.map(flag => {
                if(flag.workFlag === action.payload) {
                    flag.workFlag = '0';
                } else {
                    flag.workFlag = '1';
                }

                return flag;
            })
            return {...state, users}
        case CREATE_USER:
            return {
                ...state,
                usersAdmin: [{...state.payload}, ...state.usersAdmin]
            }
        default:
            return state;
    }

}

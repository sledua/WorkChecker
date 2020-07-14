import {UPDATE_STATUS, CREATE_USER, UPDATE_USER, RUN_FOR_USERS} from "../actions/worker";

const initialState = {
    usersAdmin: [],
    usersWorker: [],

};


export const workerReducer = (state = initialState, action) => {
    switch (action.type) {
        case RUN_FOR_USERS:
            return {
                ...state,
                usersAdmin: action.payload.filter( p => p.phone === action.input),

            }
        case UPDATE_USER:
            return  {
                ...state,
                usersAdmin: action.payload,
                usersWorker: action.payload.filter( user => user.rol === 'user' )
            }
        case UPDATE_STATUS:
            const users = state.usersAdmin.map(flag => {
                if(flag.workFlag === action.workFlag) {
                    flag.workFlag = '1';
                } else {
                    flag.workFlag = '0';
                }

                return flag;
            })
            return {...state, users}
        case CREATE_USER:
            return {
                ...state,
                usersAdmin: [...state.usersAdmin,{...state.payload}]
            }
        default:
            return state;
    }

}

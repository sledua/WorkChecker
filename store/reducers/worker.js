import {CREATE_USER, UPDATE_USER, RUN_FOR_USERS, AUTHENTICATE} from "../actions/worker";

const initialState = {
    usersAdmin: [],
    usersWorker: [],
    token: null,
};
export const workerReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return{...state,
                usersAdmin: action.payload.filter( p => p.phone === action.input),
                token: action.inputToken
            }
        case RUN_FOR_USERS:
            return {
                ...state,
                usersAdmin: action.payload.filter( p => p.phone === action.input),
                token: action.inputToken
            }
        case UPDATE_USER:
            const usersAdmin = state.usersAdmin.map(i => {
                    i.workFlag = action.workFlag
                    i.location = action.location
                    i.timer = action.timer
                return i
                }

            )

            return {...state, usersAdmin}
        case CREATE_USER:
            return {
                ...state,
                usersAdmin: [...state.usersAdmin,{...state.payload}]
            }
        default:
            return state;
    }

}

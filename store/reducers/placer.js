import {ADD_PLACE} from "../actions/worker";
const initialState = {
    usersArea: [],
}

export const placerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLACE:
            return {
                ...state,
                usersArea: [...state.usersArea,{...state.payload}]
            }
        default:
            return state;
    }
}

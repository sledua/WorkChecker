import {ADD_AREA, ADD_PLACE} from "../actions/worker";
const initialState = {
    usersArea: [],
    area: []
}

export const placerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLACE:
            return {
                ...state,
                usersArea: [...state.usersArea,{...state.payload}]
            }
        case ADD_AREA:
            return {
                ...state,
                area: [...state.area,{...state.payload}]
            }
        default:
            return state;
    }
}

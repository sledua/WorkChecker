export const CREATE_USER = 'CREATE_PRODUCT';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_STATUS = 'UPDATE_STATUS';

export const updateStatus = workFlag => {
    return {type: UPDATE_STATUS, payload: workFlag}
}
export const addUser = users => {
    users.id = Date.now().toString()

    return {
        type: CREATE_USER,
        payload: users
    }
}

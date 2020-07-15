export const CREATE_USER = 'CREATE_PRODUCT';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const RUN_FOR_USERS = 'RUN_FOR_USERS';

export const runForUsers = inputPhone => async  dispatch => {
    const response = await fetch('https://work-checker-b96e4.firebaseio.com/users.json',
        {
            method: 'GET',
            headers: {'Context-Type': 'application/json'}
        })
    const data = await response.json();
    const USERS = Object.keys(data).map(key => ({...data[key].user}))
    dispatch({
        type: RUN_FOR_USERS,
        input: inputPhone,
        payload: USERS
    })
}

export const updateUser = (id, workFlag, location, timer) => async dispatch => {
    try {
        await fetch(`https://work-checker-b96e4.firebaseio.com/users/${id}/user.json`,
            {method: 'PATCH',
                headers: {'Context-Type': 'application/json'},
                body: JSON.stringify({workFlag, location, timer})
            })
        dispatch ({
            type: UPDATE_USER,
            id,
            workFlag,
            location,
            timer
        })
    } catch (e) {
        console.log(e)
    }


}
export const updateStatus = workFlag => {
    return {
        type: UPDATE_STATUS,
        payload: workFlag
    }
}
export const addUser = user => async dispatch => {

        const response = await fetch('https://work-checker-b96e4.firebaseio.com/users.json',
            {method: 'POST',
                headers: {'Context-Type': 'application/json'},
                body: JSON.stringify({user})
            })
        const data = await response.json();
        const payload = {...user, id: data.name};
        await fetch(`https://work-checker-b96e4.firebaseio.com/users/${data.name}/user.json`,
            {method: 'PATCH',
                headers: {'Context-Type': 'application/json'},
                body: JSON.stringify({id: data.name})
            })

    console.log(data.name);
    dispatch({
        type: CREATE_USER,
        payload
    })
}

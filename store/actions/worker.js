import AsyncStorage from '@react-native-community/async-storage';
export const CREATE_USER = 'CREATE_PRODUCT';
export const UPDATE_USER = 'UPDATE_USER';
export const RUN_FOR_USERS = 'RUN_FOR_USERS';
export const ADD_PLACE = 'ADD_PLACE';
export const ADD_AREA = 'ADD_AREA';
export const AUTHENTICATE = 'AUTHENTICATE';

export const authInto = (verificationId, inputPhone) => async dispatch => {
    const response = await fetch('https://work-checker-b96e4.firebaseio.com/users.json',
        {
            method: 'GET',
            headers: {'Context-Type': 'application/json'}
        })
    const data = await response.json();
    const USERS = Object.keys(data).map(key => ({...data[key].user}))
    dispatch({
        type: AUTHENTICATE,
        inputToken: verificationId,
        input: inputPhone,
        payload: USERS,

    })
}
export const runForUsers = (verificationId, inputPhone) => async  dispatch => {
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
        payload: USERS,
        inputToken: verificationId
    })
    await saveDataUser(verificationId, inputPhone)
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
export const addPlace = users_area => async  dispatch => {
    const response = await fetch('https://work-checker-b96e4.firebaseio.com/users_area.json',
        {method: 'POST',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({users_area})
        })
    const data = await response.json();
    const payload = {...users_area, id: data.name};
    await fetch(`https://work-checker-b96e4.firebaseio.com/users_area/${data.name}/users_area.json`,
        {method: 'PATCH',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({id: data.name})
        })
    dispatch({
        type: ADD_PLACE,
        payload
    })
}
export const addAreas = area => async  dispatch => {
    const response = await fetch('https://work-checker-b96e4.firebaseio.com/area.json',
        {method: 'POST',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({area})
        })
    const data = await response.json();
    const payload = {...area, id: data.name};
    await fetch(`https://work-checker-b96e4.firebaseio.com/area/${data.name}/area.json`,
        {method: 'PATCH',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({id: data.name})
        })
    dispatch({
        type: ADD_AREA,
        payload
    })
}
export const addUser = user => async dispatch => {
    const res = await fetch('https://work-checker-b96e4.firebaseio.com/locations.json', {
        method: 'POST',
        headers: {'Context-Type': 'application/json'},
        body: JSON.stringify({name: user.name, phone: user.phone})
    })
    const dataloc = await res.json();
    await fetch(`https://work-checker-b96e4.firebaseio.com/locations/${dataloc.name}.json`,
        {method: 'PATCH',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({id: dataloc.name})
        })

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
    dispatch({
        type: CREATE_USER,
        payload
    })
}
const saveDataUser = async (token, inputPhone) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify({
            token: token,
            inputPhone: inputPhone
        }));
    } catch (error) {
        console.log('eee action', error)
    }
}

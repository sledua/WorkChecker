export const SIGNUP = 'SIGNUP';
export const signup = (phone) => {
    return async dispatch => {
        const res = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAc2265y__KIgMYtFeosl_KvDTeP92SmkY',
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({

            })
        });
        if(!res.ok) {
            throw new Error('Obratites k adminu');
        }
        const resData = await res.json();
        console.log(resData);
        dispatch({type: SIGNUP})
    }
}

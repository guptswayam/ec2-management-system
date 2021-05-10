import * as actionTypes from "./actionTypes";

const loginSuccess = (user)=>{
    return {
        type: actionTypes.LOGIN_SUCCESS,
        user: user
    }
}

const loginFailed = ()=>{
    return {
        type: actionTypes.LOGIN_FAILED
    }
}

const authStart = ()=>{
    return {
        type: actionTypes.AUTH_START
    }
}

export const checkUserSession = ()=>{
    return async dispatch=>{
        try {
            dispatch(authStart());
            const res = await fetch("/api/v1/users/me");
            const resData = await res.json();
            if(resData.status === "success")
                dispatch(loginSuccess(resData.data));
            else
                dispatch(loginFailed());
        } catch (error) {
            console.log(error);
            dispatch(loginFailed());
        }
    }
}
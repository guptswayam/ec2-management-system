import * as actionTypes from "./../actions/actionTypes"
const initialState = {
    user: null,
    loading: false,
    error: false
}

const reducer = (state=initialState, action)=>{
    switch(action.type){
        case actionTypes.LOGIN_SUCCESS: 
            return {
                user: action.user,
                error: false,
                loading: false
            }
        case actionTypes.LOGIN_FAILED:
            return {
                user: null,
                error: true,
                loading: false
            }
        case actionTypes.AUTH_START:
            return {
                ...state,
                loading: true
            }
        default: return state;
    }
}

export default reducer;
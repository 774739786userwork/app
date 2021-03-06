import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: undefined,
    errMsg: undefined,
    code:0,
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case types.Logining_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                data: undefined,
            });
        case types.LoginError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: undefined,
                errMsg: action.errMsg,
                code:action.code
            });
        case types.LoginSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: action.result,
                errMsg: undefined,
                code:0,
                
            });
        default:
            return state;
    }
}
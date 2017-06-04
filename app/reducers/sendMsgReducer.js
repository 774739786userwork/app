import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: undefined,
    errMsg: undefined,
    code: 0,
}

export default function sendMsgReducer(state = initialState, action) {
    switch (action.type) {
        case types.SendMsging_ACTION:
        case types.Login4Msging_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                data: undefined,
            });
        case types.SendMsgError_ACTION:
        case types.Login4MsgError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: undefined,
                errMsg: action.errMsg,
                code: action.code
            });
        case types.SendMsgSucceed_ACTION:
        case types.Login4MsgSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                errMsg: undefined,
                data: action.result,
            });
        default:
            return state;
    }
}
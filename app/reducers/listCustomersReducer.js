import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: [],
    errMsg: undefined,
}

export default function listCustomersReducer(state = initialState, action) {
    switch (action.type) {
        case types.ListCustomersing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                 data: [],
            });
        case types.ListCustomersError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: [],
                errMsg: action.errMsg,
            });
        case types.ListCustomersSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: action.result,
                errMsg: undefined,
            });
        default:
            return state;
    }
}
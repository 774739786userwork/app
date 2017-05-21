import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: [],
    errMsg: undefined,
}

export default function selectStoreReducer(state = initialState, action) {
    switch (action.type) {
        case types.SelectStoreing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                 data: [],
            });
        case types.SelectStoreError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: [],
                errMsg: action.errMsg,
            });
        case types.SelectStoreSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: action.result,
                errMsg: undefined,
            });
        default:
            return state;
    }
}
import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: [],
    errMsg: undefined,
}

export default function selectNameReducer(state = initialState, action) {
    switch (action.type) {
        case types.SelectNameing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                 data: [],
            });
        case types.SelectNameError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: [],
                errMsg: action.errMsg,
            });
        case types.SelectNameSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: action.result,
                errMsg: undefined,
            });
        default:
            return state;
    }
}
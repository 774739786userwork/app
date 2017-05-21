import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    data: [],
    errMsg: undefined,
}

export default function selectCarReducer(state = initialState, action) {
    switch (action.type) {
        case types.SelectCaring_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                 data: [],
            });
        case types.SelectCarError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: [],
                errMsg: action.errMsg,
            });
        case types.SelectCarSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                data: action.result,
                errMsg: undefined,
            });
        default:
            return state;
    }
}
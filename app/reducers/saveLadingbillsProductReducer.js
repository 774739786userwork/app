import * as types from '../actions/ActionTypes';
const initialState = {
    saving: false,
    errMsg: undefined,
    seccued:false,
}

export default function saveLadingbillsProductReducer(state = initialState, action) {
    switch (action.type) {
        case types.SaveLadingbillsProducting_ACTION:
            return Object.assign({}, state, {
                saving: true,
                errMsg: undefined,
                seccued:false,
            });
        case types.SaveLadingbillsProductError_ACTION:
            return Object.assign({}, state, {
                saving: false,
                errMsg: action.errMsg,
            });
        case types.SaveLadingbillsProductSucceed_ACTION:
            return Object.assign({}, state, {
                saving: false,
                seccued:true,
                errMsg: undefined,
            });

        default:
            return state;
    }
}
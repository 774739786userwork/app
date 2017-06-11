import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    loadMore: false,
    errMsg: undefined,
    result: [],
    carList: [],
    selectCar: undefined,
}

export default function addDeliveryOrderReducer(state = initialState, action) {
    switch (action.type) {
        case types.AddDeliveryOrdering_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                result: [],
            });
        case types.AddDeliveryOrdering4Car_ACTION:
            return Object.assign({}, state, {
                carloading: true,
                errMsg: undefined,
                carList: [],
                result: [],
            });
        case types.AddDeliveryOrderError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                carloading: false,
                errMsg: action.errMsg,
            });
        case types.AddDeliveryOrder4CarSucceed_ACTION:
            let selectCar = undefined;
            if (action.result && action.result.length > 0) {
                selectCar = action.result[0]
            }
            return Object.assign({}, state, {
                carList: action.result, selectCar, carloading: false,
            });
        case types.AddDeliveryOrderSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                result: action.result,
                errMsg: undefined,
            });

        case types.AddDeliveryOrdering_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
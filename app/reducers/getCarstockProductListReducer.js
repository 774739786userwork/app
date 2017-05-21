
import * as types from '../actions/ActionTypes';


const initialState = {
    loading: false,
    loadMore: false,
    errMsg: undefined,
    result: []

}

export default function getCarstockProductListReducer(state = initialState, action) {
    switch (action.type) {
        case types.GetCarstockProductListing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                result: []
            });
        case types.GetCarstockProductListError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                errMsg: action.errMsg,
            });
        case types.GetCarstockProductListSucceed_ACTION:
            {
                let listData = [];
                if (action.result) {
                    action.result.forEach((e) => {
                        //stock 库存
                        //disburden_quantity 卸货数量
                        //stock_quantity 余货数量
                        e.disburden_quantity = e.stock;
                        e.stock_quantity = 0;
                        listData.push(e);
                    });
                }
                return Object.assign({}, state, {
                    loading: false,
                    result: listData,
                });
            }
        case types.GetCarstockProductListDisburden_ACTION:
            {
                let listData = [];
                if (state.result) {
                    state.result.forEach((e) => {
                        //stock 库存
                        //disburden_quantity 卸货数量
                        //stock_quantity 余货数量
                        e.disburden_quantity = e.stock;
                        e.stock_quantity = 0;
                        if (e.id === action.param.id) {
                            e.disburden_quantity = action.param.count;
                            e.stock_quantity = e.stock - action.param.count;
                        }
                        listData.push(e);
                    });
                }
                return Object.assign({}, state, {
                    loading: false,
                    result: listData,
                });
            }
        default:
            return state;
    }
}
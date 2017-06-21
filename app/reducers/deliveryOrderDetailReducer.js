import React, {
    ListView,
} from 'react-native';

import * as types from '../actions/ActionTypes';

var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const initialState = {
    loading: false,
    loadMore: false,
    count: 0,
    listData: dataSource.cloneWithRows([]),//数据源
    errMsg: undefined,
    result:[]

}

export default function deliveryOrderDetailReducer(state = initialState, action) {
    switch (action.type) {
        case types.DeliveryOrderDetailing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.DeliveryOrderDetailError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.DeliveryOrderDetailSucceed_ACTION:

            if (state.loadMore) {
                let list = state.result.productLists.concat(action.result.productLists);
                return Object.assign({}, state, {
                    loading: false,
                    loadMore:false,
                    count:action.result.productLists.length,
                    result:action.result,
                    listData: dataSource.cloneWithRows(list),//数据源
                    errMsg: undefined,
                });
            } else {
                return Object.assign({}, state, {
                    loading: false,
                    count:action.result.productLists.length,
                    result:action.result,
                    listData: dataSource.cloneWithRows(action.result.productLists),//数据源
                    errMsg: undefined,
                });
            }

        case types.DeliveryOrderDetailing_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
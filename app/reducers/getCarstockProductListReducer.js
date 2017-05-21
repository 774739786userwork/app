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
    result: []

}

export default function getCarstockProductListReducer(state = initialState, action) {
    switch (action.type) {
        case types.GetCarstockProductListing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.GetCarstockProductListError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.GetCarstockProductListSucceed_ACTION:

            return Object.assign({}, state, {
                loading: false,
                result: action.result,
                listData: dataSource.cloneWithRows(action.result),//数据源
                errMsg: undefined,
            });

        case types.GetCarstockProductListing_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
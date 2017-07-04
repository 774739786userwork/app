import React, {
    ListView,
} from 'react-native';

import * as types from '../actions/ActionTypes';

var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const initialState = {
    loading: false,
    loadMore: false,
    saving: false,
    listData: dataSource.cloneWithRows([]),//数据源
    errMsg: undefined,
    result: [],
    seccued: false,
}
/**
 * 提货单 产品列表
 */
export default function addLadingbillsProductReducer(state = initialState, action) {
    switch (action.type) {
        case types.AddLadingbillsProducting_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                seccued: false,
                saving: false,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.AddLadingbillsProductError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.AddLadingbillsProductSucceed_ACTION:
            if (state.loadMore) {
                let list = state.result.concat(action.result.data);
                return Object.assign({}, state, {
                    loading: false,
                    loadMore: false,
                    result: list,
                    listData: dataSource.cloneWithRows(list),//数据源
                    errMsg: undefined,
                });
            } else {
                return Object.assign({}, state, {
                    loading: false,
                    result: action.result.data,
                    listData: dataSource.cloneWithRows(action.result.data),//数据源
                    errMsg: undefined,
                });
            }

        case types.AddLadingbillsProducting_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        case types.SaveLadingbillsProducting_ACTION:
            return Object.assign({}, state, {
                saving: true,
                errMsg: undefined,
                seccued: false,
            });
        case types.SaveLadingbillsProductError_ACTION:
            return Object.assign({}, state, {
                saving: false,
                seccued: true,
                errMsg: action.errMsg,
            });
        case types.SaveLadingbillsProductSucceed_ACTION:
            return Object.assign({}, state, {
                saving: false,
                seccued: true,
                errMsg: undefined,
            });
        default:
            return state;
    }
}
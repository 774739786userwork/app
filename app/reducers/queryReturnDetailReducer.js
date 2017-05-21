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

export default function queryReturnDetailReducer(state = initialState, action) {
    switch (action.type) {
        case types.QueryReturnDetailing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.QueryReturnDetailError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.QueryReturnDetailSucceed_ACTION:
            if (state.loadMore) {
                let list = state.result.concat(action.result.data);
                return Object.assign({}, state, {
                    loading: false,
                    loadMore:false,
                    result:list,
                    listData: dataSource.cloneWithRows(list),//数据源
                    errMsg: undefined,
                });
            } else {
                return Object.assign({}, state, {
                    loading: false,
                    result:action.result.data,
                    listData: dataSource.cloneWithRows(action.result.data),//数据源
                    errMsg: undefined,
                });
            }

        case types.QueryReturnDetailing_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
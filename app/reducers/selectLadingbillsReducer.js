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

export default function selectLadingbillsReducer(state = initialState, action) {
    switch (action.type) {
        case types.SelectLadingbillsing_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.SelectLadingbillsError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.SelectLadingbillsSucceed_ACTION:
            if (state.loadMore) {
                let list = state.result.concat(action.result.ladbiling_order_list);
                return Object.assign({}, state, {
                    loading: false,
                    loadMore: false,
                    count: action.result.total_record,
                    begin_date: action.result.begin_date,
                    end_date: action.result.end_date,
                    result: list,
                    listData: dataSource.cloneWithRows(list),//数据源
                    errMsg: undefined,
                });
            } else {
                return Object.assign({}, state, {
                    loading: false,
                    count: action.result.total_record,
                    begin_date: action.result.begin_date,
                    end_date: action.result.end_date,
                    result: action.result.ladbiling_order_list,
                    listData: dataSource.cloneWithRows(action.result.ladbiling_order_list),//数据源
                    errMsg: undefined,
                });
            }

        case types.SelectLadingbillsing_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
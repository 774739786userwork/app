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
    result: [],
    d_total_sum: 0,
    d_unpaid_total_sum: 0,
    d_count_small_change_sum: 0,
    delivery_note_number: 0,
    d_distribution_sum: 0,
    d_discount_sum: 0,
}

export default function selectDeliveryOrderReducer(state = initialState, action) {
    switch (action.type) {
        case types.SelectDeliveryOrdering_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                count: 0,
                d_total_sum: 0,
                d_unpaid_total_sum: 0,
                d_count_small_change_sum: 0,
                delivery_note_number: 0,
                listData: dataSource.cloneWithRows([]),//数据源
            });
        case types.SelectDeliveryOrderError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                count: 0,
                listData: dataSource.cloneWithRows([]),//数据源
                errMsg: action.errMsg,
            });
        case types.SelectDeliveryOrderSucceed_ACTION:
            if (!action.result.d_distribution_sum) {
                return Object.assign({}, state, {
                    loading: false,
                    loadMore: false,
                    count: 0,
                    d_total_sum: 0,
                    d_unpaid_total_sum: 0,
                    d_count_small_change_sum: 0,
                    delivery_note_number: 0,
                    errMsg: undefined,
                });
            } else if (state.loadMore) {
                let list = state.result.concat(action.result.delivery_order_list);
                return Object.assign({}, state, {
                    loading: false,
                    loadMore: false,
                    count: action.result.total_record,
                    result: list,
                    begin_date: action.result.begin_date,
                    end_date: action.result.end_date,
                    d_distribution_sum: action.result.d_distribution_sum,
                    d_discount_sum: action.result.d_discount_sum,
                    d_total_sum: action.result.d_total_sum,
                    d_unpaid_total_sum: action.result.d_unpaid_total_sum,
                    d_count_small_change_sum: action.result.d_count_small_change_sum,
                    delivery_note_number: action.result.delivery_note_number,
                    listData: dataSource.cloneWithRows(list),//数据源
                    errMsg: undefined,
                });
            } else {
                return Object.assign({}, state, {
                    loading: false,
                    count: action.result.total_record,
                    result: action.result.delivery_order_list,
                    begin_date: action.result.begin_date,
                    end_date: action.result.end_date,
                    d_distribution_sum: action.result.d_distribution_sum,
                    d_discount_sum: action.result.d_discount_sum,
                    d_total_sum: action.result.d_total_sum,
                    d_unpaid_total_sum: action.result.d_unpaid_total_sum,
                    d_count_small_change_sum: action.result.d_count_small_change_sum,
                    delivery_note_number: action.result.delivery_note_number,
                    listData: dataSource.cloneWithRows(action.result.delivery_order_list ? action.result.delivery_order_list : []),//数据源
                    errMsg: undefined,
                });
            }

        case types.SelectDeliveryOrdering_More_ACTION:
            return Object.assign({}, state, {
                loadMore: true,
            });
        default:
            return state;
    }
}
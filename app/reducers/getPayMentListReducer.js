import React, {
    ListView,
} from 'react-native';

import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false,
    listData: [],//数据源
    errMsg: undefined,
    totalSum: 0
}

export default function getPayMentListReducer(state = initialState, action) {
    switch (action.type) {
        case types.QueryPayMentList_ACTION:
            return Object.assign({}, state, {
                loading: true,
                errMsg: undefined,
                totalSum: 0,
                listData: [],//数据源
            });
        case types.QueryPayMentListError_ACTION:
            return Object.assign({}, state, {
                loading: false,
                listData: [],//数据源
                totalSum: 0,
                errMsg: action.errMsg,
            });
        case types.QueryPayMentListSucceed_ACTION:
            return Object.assign({}, state, {
                loading: false,
                listData: action.result,
                errMsg: undefined,
                totalSum: action.totalSum
            });
        default:
            return state;
    }
}
import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* queryReturnLists(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) { }
    responseData = mock(action.api, action.param);
    console.log(responseData)
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.QueryReturnListsSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.QueryReturnListsError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.QueryReturnListsError_ACTION, errMsg: e });
  }
}
//退货单查询
export function* watchQueryReturnLists() {
  yield takeLatest(types.QueryReturnListsing_ACTION, queryReturnLists);
  yield takeLatest(types.QueryReturnListsing_More_ACTION, queryReturnLists);
}

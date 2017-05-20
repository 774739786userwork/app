import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* selectDeliveryOrder(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) { }
    responseData = mock(action.api, action.param);
    console.log(responseData)
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.SelectDeliveryOrderSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SelectDeliveryOrderError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.SelectDeliveryOrderError_ACTION, errMsg: e });
  }
}
export function* watchSelectDeliveryOrder() {
  yield takeLatest(types.SelectDeliveryOrdering_ACTION, selectDeliveryOrder);
  yield takeLatest(types.SelectDeliveryOrdering_More_ACTION, selectDeliveryOrder);
}

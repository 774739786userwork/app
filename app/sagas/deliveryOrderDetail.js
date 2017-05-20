import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* deliveryOrderDetail(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) { }
    responseData = mock(action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.DeliveryOrderDetailSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.DeliveryOrderDetailError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.DeliveryOrderDetailError_ACTION, errMsg: e });
  }
}
export function* watchDeliveryOrderDetail() {
  yield takeLatest(types.DeliveryOrderDetailing_ACTION, deliveryOrderDetail);
  yield takeLatest(types.DeliveryOrderDetailing_More_ACTION, deliveryOrderDetail);
}

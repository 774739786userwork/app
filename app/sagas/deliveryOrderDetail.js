import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* deliveryOrderDetail(action) {
  try {
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.DeliveryOrderDetailSucceed_ACTION, result: responseData.data });
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

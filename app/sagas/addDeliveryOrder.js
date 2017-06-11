import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
export function* addDeliveryOrder(action) {
  try {
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.AddDeliveryOrderSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.AddDeliveryOrderError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.AddDeliveryOrderError_ACTION, errMsg: e });
  }
}
export function* getCar4Delivery(action) {
  try {
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.AddDeliveryOrder4CarSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.AddDeliveryOrderError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.AddDeliveryOrderError_ACTION, errMsg: e });
  }
}
export function* watchAddDeliveryOrder() {
  yield takeLatest(types.AddDeliveryOrdering_ACTION, addDeliveryOrder);
  yield takeLatest(types.AddDeliveryOrdering4Car_ACTION, getCar4Delivery);
}

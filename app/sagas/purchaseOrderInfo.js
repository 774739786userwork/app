import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* purchaseOrderInfo(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) { }
    responseData = mock(action.api, action.param);
    console.log(responseData);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.PurchaseOrderInfoSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.PurchaseOrderInfoError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e);
    yield put({ type: types.PurchaseOrderInfoError_ACTION, errMsg: e });
  }
}
export function* watchPurchaseOrderInfo() {
  yield takeLatest(types.PurchaseOrderInfoing_ACTION, purchaseOrderInfo);
  yield takeLatest(types.PurchaseOrderInfoing_More_ACTION, purchaseOrderInfo);
}

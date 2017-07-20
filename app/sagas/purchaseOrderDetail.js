import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* purchaseOrderDetail(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.PurchaseOrderDetailSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.PurchaseOrderDetailError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e);
    yield put({ type: types.PurchaseOrderDetailError_ACTION, errMsg: e });
  }
}
export function* watchPurchaseOrderDetail() {
  yield takeLatest(types.PurchaseOrderDetailing_ACTION, purchaseOrderDetail);
  yield takeLatest(types.PurchaseOrderDetailing_More_ACTION, purchaseOrderDetail);
}

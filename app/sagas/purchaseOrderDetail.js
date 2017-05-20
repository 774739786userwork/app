import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* PurchaseOrderDetail(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.PurchaseOrderDetailSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.PurchaseOrderDetailError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.PurchaseOrderDetailError_ACTION, errMsg: e });
  }
}
export function* watchPurchaseOrderDetail() {
  yield takeLatest(types.PurchaseOrderDetailing_ACTION, PurchaseOrderDetail);
  yield takeLatest(types.PurchaseOrderDetailing_More_ACTION, PurchaseOrderDetail);
}

import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* PurchaseOrderInfo(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.PurchaseOrderInfoSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.PurchaseOrderInfoError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.PurchaseOrderInfoError_ACTION, errMsg: e });
  }
}
export function* watchPurchaseOrderInfo() {
  yield takeLatest(types.PurchaseOrderInfoing_ACTION, PurchaseOrderInfo);
  yield takeLatest(types.PurchaseOrderInfoing_More_ACTION, PurchaseOrderInfo);
}

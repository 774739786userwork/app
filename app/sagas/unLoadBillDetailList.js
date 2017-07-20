import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* UnLoadBillDetailList(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.UnLoadBillDetailListSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.UnLoadBillDetailListError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e);
    yield put({ type: types.UnLoadBillDetailListError_ACTION, errMsg: e });
  }
}
export function* watchUnLoadBillDetailList() {
  yield takeLatest(types.UnLoadBillDetailListing_ACTION, UnLoadBillDetailList);
  yield takeLatest(types.UnLoadBillDetailListing_More_ACTION, UnLoadBillDetailList);
}

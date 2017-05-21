import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* getCarstockProductList(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) { }
    responseData = mock(action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.GetCarstockProductListSucceed_ACTION, result: responseData.data.good_list });
    } else {
      yield put({ type: types.GetCarstockProductListError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.GetCarstockProductListError_ACTION, errMsg: e });
  }
}
export function* watchGetCarstockProductList() {
  yield takeLatest(types.GetCarstockProductListing_ACTION, getCarstockProductList);
  yield takeLatest(types.GetCarstockProductListing_More_ACTION, getCarstockProductList);
}

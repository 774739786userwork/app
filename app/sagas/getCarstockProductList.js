import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* getCarstockProductList(action) {
  try {
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.GetCarstockProductListSucceed_ACTION, result: responseData.data });
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

import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* saveLadingbillsProduct(action) {
  try {
    let responseData = yield call(FetchManger.postUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.SaveLadingbillsProductSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.SaveLadingbillsProductError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.SaveLadingbillsProductError_ACTION, errMsg: e });
  }
}
export function* watchSaveLadingbillsProduct() {
  yield takeLatest(types.SaveLadingbillsProducting_ACTION, saveLadingbillsProduct);
}

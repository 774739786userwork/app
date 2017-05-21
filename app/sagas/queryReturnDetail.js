import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'
import mock from './mock'

export function* queryReturnDetail(action) {
  try {
    let responseData;
    try {
      responseData = yield call(FetchManger.getUri, action.api, action.param);
    } catch (e) {
      responseData = mock(action.api, action.param);
      console.log(responseData)
    }
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.QueryReturnDetailSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.QueryReturnDetailError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.QueryReturnDetailError_ACTION, errMsg: e });
  }
}
export function* watchQueryReturnDetail() {
  yield takeLatest(types.QueryReturnDetailing_ACTION, queryReturnDetail);
  yield takeLatest(types.QueryReturnDetailing_More_ACTION, queryReturnDetail);
}

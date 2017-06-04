import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* login(action) {
  try {
    const responseData = yield call(FetchManger.postUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.LoginSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.LoginError_ACTION, errMsg: responseData.msg, code: responseData.status });
    }
  } catch (e) {
    yield put({ type: types.LoginError_ACTION, errMsg: e });
  }
}
export function* watchRequestLogin() {
  yield takeLatest(types.Logining_ACTION, login);
}

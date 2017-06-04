import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* sendMsg(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.SendMsgSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SendMsgSucceed_ACTION, errMsg: responseData.msg, code: responseData.status });
    }
  } catch (e) {
    yield put({ type: types.SendMsgSucceed_ACTION, errMsg: e });
  }
}
export function* login(action) {
  try {
    const responseData = yield call(FetchManger.postUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.Login4MsgSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.Login4MsgError_ACTION, errMsg: responseData.msg, code: responseData.status });
    }
  } catch (e) {
    yield put({ type: types.Login4MsgError_ACTION, errMsg: e });
  }
}
export function* watchLogin4msg() {
  yield takeLatest(types.SendMsging_ACTION, sendMsg);
  yield takeLatest(types.Login4Msging_ACTION, login);
}

import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* selectStore(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.SelectStoreSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SelectStoreError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.SelectStoreError_ACTION, errMsg: e });
  }
}
export function* watchRequestSelectStore() {
  yield takeLatest(types.SelectStoreing_ACTION, selectStore);
}

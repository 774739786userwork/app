import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* selectName(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.SelectNameSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SelectNameError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.SelectNameError_ACTION, errMsg: e });
  }
}
export function* watchRequestSelectName() {
  yield takeLatest(types.SelectNameing_ACTION, selectName);
}

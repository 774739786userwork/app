import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* selectCar(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.SelectCarSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SelectCarError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.SelectCarError_ACTION, errMsg: e });
  }
}
export function* watchRequestSelectCar() {
  yield takeLatest(types.SelectCaring_ACTION, selectCar);
}

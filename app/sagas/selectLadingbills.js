import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* selectLadingbills(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.result === '0' || responseData.result === 0) {
      yield put({ type: types.SelectLadingbillsSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.SelectLadingbillsError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.SelectLadingbillsError_ACTION, errMsg: e });
  }
}
export function* watchSelectLadingbills() {
  yield takeLatest(types.SelectLadingbillsing_ACTION, selectLadingbills);
  yield takeLatest(types.SelectLadingbillsing_More_ACTION, selectLadingbills);
}

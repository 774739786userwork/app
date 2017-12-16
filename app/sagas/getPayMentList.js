import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* getPayMentList(action) {
  try {
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (responseData.status === '0' || responseData.status === 0) {
      console.log('responseData-->' + responseData.status);
      yield put({ type: types.QueryPayMentListSucceed_ACTION, result: responseData });
    } else {
      yield put({ type: types.QueryPayMentListError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e);
    yield put({ type: types.QueryPayMentListError_ACTION, errMsg: e });
  }
}
export function* watchGetPaymentList() {
  yield takeLatest(types.QueryPayMentList_ACTION, getPaymentList);
  yield takeLatest(types.QueryPayMentList_More_ACTION, getPaymentList);
}

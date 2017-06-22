import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* listCustomers(action) {
  try {
    const responseData = yield call(FetchManger.getUri, action.api, action.param);
    if (!responseData.data) {
      responseData.data = {}
    }
    if (responseData.status === '0' || responseData.status === 0 || responseData.data.status === 0) {
      yield put({ type: types.ListCustomersSucceed_ACTION, result: responseData.data.customerLists });
    } else {
      yield put({ type: types.ListCustomersError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    console.log(e)
    yield put({ type: types.ListCustomersError_ACTION, errMsg: e });
  }
}
export function* watchRequestListCustomers() {
  yield takeLatest(types.ListCustomersing_ACTION, listCustomers);
}

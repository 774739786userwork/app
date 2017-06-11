import { put, takeLatest, call, fork } from 'redux-saga/effects';

import * as types from '../actions/ActionTypes';
import { FetchManger } from 'react-native-go'

export function* selectDeliveryOrder(action) {
  try{
    let responseData = yield call(FetchManger.getUri, action.api, action.param);
    responseData = {
      "msg": "数据加载成功",
      "data": {
        "total_record": 11,
        "begin_date": "2017-05-25",
        "end_date": "2017-06-01",
        "d_total_sum": 2780,
        "d_unpaid_total_sum": 0,
        "d_count_small_change_sum": 0.56,
        "d_distribution_sum": 0.56,
        "d_discount_sum": 0.56,
        "delivery_note_number": 10,
        "delivery_order_list": [
          {
            "delivery_id": 16012,
            "delivery_date": "2017-05-02",
            "serial_number": "1605030140",
            "customer_id": 2017,
            "customer_name": "华润漆",
            "contacts_mobile": "15111010445",
            "customer_address": "天心区新开铺百姓建材市场1栋5号",
            "contacts_name": "万许捷",
            "goodsList": [{ "name": "内墙（小）", "quantity": "10", "unit": "包" }, { "name": "外墙（普）", "quantity": "20", "unit": "包" }, { "name": "小桶108胶水", "quantity": "13", "unit": "桶" }],
            "total_sum": 2240,
            "unpaid_total_sum": 0,
            "count_small_change_sum": 0
          },
          {
            "delivery_id": 16013,
            "delivery_date": "2017-05-02",
            "serial_number": "1605030147",
            "customer_id": 2018,
            "customer_name": "桥头",
            "contacts_mobile": "13787287943",
            "customer_address": "新开铺欣欣家园对面桥头",
            "contacts_name": "桥头",
            "goodsList": [{ "name": "内墙（小）", "quantity": "10", "unit": "包" }, { "name": "外墙（普）", "quantity": "20", "unit": "包" }, { "name": "小桶108胶水", "quantity": "13", "unit": "桶" }],
            "total_sum": 540,
            "unpaid_total_sum": 45,
            "count_small_change_sum": 0.56
          }
        ]
      },
      "status": 0
    }
    if (responseData.status === '0' || responseData.status === 0) {
      yield put({ type: types.SelectDeliveryOrderSucceed_ACTION, result: responseData.data });
    } else {
      yield put({ type: types.SelectDeliveryOrderError_ACTION, errMsg: responseData.msg });
    }
  } catch (e) {
    yield put({ type: types.SelectDeliveryOrderError_ACTION, errMsg: e });
  }
}
export function* watchSelectDeliveryOrder() {
  yield takeLatest(types.SelectDeliveryOrdering_ACTION, selectDeliveryOrder);
  yield takeLatest(types.SelectDeliveryOrdering_More_ACTION, selectDeliveryOrder);
}

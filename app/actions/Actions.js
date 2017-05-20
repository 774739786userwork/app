import * as types from './ActionTypes';
import { LoginInfo } from 'react-native-go'

/**
 * 用户登录
 */
export function loginingActon(username, password) {
    return {
        type: types.Logining_ACTION,
        api: types.Login_API,
        param: { username, password }
    };
}

/**
 * 提货单查询
 */
export function selectLadingbills(begin_date, end_date, start = 0, rows = 10) {
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.SelectLadingbillsing_More_ACTION,
            api: types.SelectLadingbills_API,
            param: { user_id, begin_date, end_date, page, rows }
        };
    } else {
        return {
            type: types.SelectLadingbillsing_ACTION,
            api: types.SelectLadingbills_API,
            param: { user_id, begin_date, end_date, page, rows }
        };
    }

}
/**
 * 订货单查询 详细
 */
export function purchaseOrderDetail(start = 0, rows = 10) {
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.PurchaseOrderDetailing_More_ACTION,
            api: types.PurchaseOrderDetail_API,
            param: { user_id, page, rows }
        };
    } else {
        return {
            type: types.PurchaseOrderDetailing_ACTION,
            api: types.PurchaseOrderDetail_API,
            param: { user_id, page, rows }
        };
    }

}
/**
 * 订货单查询 详细
 */
export function purchaseOrderInfo(start = 0, rows = 10) {
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.PurchaseOrderInfoing_More_ACTION,
            api: types.PurchaseOrderInfo_API,
            param: { user_id, page, rows }
        };
    } else {
        return {
            type: types.PurchaseOrderInfoing_ACTION,
            api: types.PurchaseOrderInfo_API,
            param: { user_id, page, rows }
        };
    }

}
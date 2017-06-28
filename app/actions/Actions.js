import * as types from './ActionTypes';
import { LoginInfo } from 'react-native-go'
import DeviceInfo from 'react-native-device-info';
/**
 * 
dept_id:"100003"
dxyzm:""
mobile_number:""
mobilesequencenumber:"F797268C-1358-4C05-ACFA-8FB5CF9C848A"
org_pinyin:"KMDB"
organization_id:"100002"
organization_name:"昆明多邦"
password:"123456"
roles:""
token:"QYoMtach4MK"
user_id:"100002"
user_real_name:"张士军"
username:"zhangshijun"
 * 用户登录
 */
export function loginingActon(username, password) {

    return {
        type: types.Logining_ACTION,
        api: types.Login_API,
        param: { username, password, mobilesequencenumber: DeviceInfo.getUniqueID() }
    };
}
//发送短信验证码
export function buildRand(mobile_number) {

    return {
        type: types.SendMsging_ACTION,
        api: types.SendMsg_API,
        param: { mobile_number }
    };
}

//短信登录 
export function appUserlandDX(username, password, dxyzm) {

    return {
        type: types.Login4Msging_ACTION,
        api: types.Login4Msg_API,
        param: { username, password, dxyzm, mobilesequencenumber: DeviceInfo.getUniqueID() }
    };
}
//客户列表查询
export function listCustomers(lat, lng, contactMobile) {
    const orgId = LoginInfo.getUserInfo().organization_id;//LoginInfo.getUserInfo().user_id;
     const user_id = LoginInfo.getUserInfo().user_id;//LoginInfo.getUserInfo().user_id;
    const token = LoginInfo.getUserInfo().token;
    let param = {  token, orgId,user_id };
    if (contactMobile) {
        param.contactMobile = contactMobile;
    }else{
        param.lat = lat;
        param.lng = lng
    }
    return {
        type: types.ListCustomersing_ACTION,
        api: types.ListCustomers_API,
        param: param
    };
}
/**
 * 开送货单获取产品数据接口
 * @param {*} begin_date 
 * @param {*} end_date 
 * @param {*} start 
 * @param {*} rows 
 * ?user_id=100002&org_id=100002&car_id=149&token=p59tYTPlRBS59Xe
 */
export function addDeliveryOrder(car_id, start = 0, rows = 10) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    const org_id = LoginInfo.getUserInfo().organization_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.AddDeliveryOrdering_More_ACTION,
            api: types.AddDeliveryOrder_API,
            param: { user_id,token,org_id, car_id }
        };
    } else {
        return {
            type: types.AddDeliveryOrdering_ACTION,
            api: types.AddDeliveryOrder_API,
            param: { user_id,token,org_id, car_id }
        };
    }

}
/**
 * 开送货单 车牌查询接口
 * mobileServiceManager/customers/getCarInfoJson.page?user_id=100002&token=xKJ6ZrR6ws0Z
 */
export function getCar4Delivery() {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    return {
        type: types.AddDeliveryOrdering4Car_ACTION,
        api: 'mobileServiceManager/customers/getCarInfoJson.page',
        param: { token, user_id }
    };

}
/**
 * 提货单查询
 */
export function selectLadingbills(begin_date, end_date, start = 0, rows = 10) {
    const user_id = LoginInfo.getUserInfo().user_id;
    const token = LoginInfo.getUserInfo().token;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.SelectLadingbillsing_More_ACTION,
            api: types.SelectLadingbills_API,
            param: { user_id, token,/* begin_date, end_date, */page, rows }
        };
    } else {
        return {
            type: types.SelectLadingbillsing_ACTION,
            api: types.SelectLadingbills_API,
            param: { token, user_id, /* begin_date, end_date, */ page, rows }
        };
    }

}
/**
 * 订货单查询 详细
 */
export function purchaseOrderDetail(start = 0, rows = 10) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.PurchaseOrderDetailing_More_ACTION,
            api: types.PurchaseOrderDetail_API,
            param: { token, user_id, page, rows }
        };
    } else {
        return {
            type: types.PurchaseOrderDetailing_ACTION,
            api: types.PurchaseOrderDetail_API,
            param: { token, user_id, page, rows }
        };
    }

}
/**
 * 订货单查询 详细
 */
export function purchaseOrderInfo(start = 0, rows = 10) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.PurchaseOrderInfoing_More_ACTION,
            api: types.PurchaseOrderInfo_API,
            param: { token, user_id, page, rows }
        };
    } else {
        return {
            type: types.PurchaseOrderInfoing_ACTION,
            api: types.PurchaseOrderInfo_API,
            param: { token, user_id, page, rows }
        };
    }

}
/**
 * 送货单查询 详情
 */
export function deliveryOrderDetail(delivery_id) {
    const token = LoginInfo.getUserInfo().token;
    return {
        type: types.DeliveryOrderDetailing_ACTION,
        api: types.DeliveryOrderDetail_API,
        param: { token, delivery_id }
    };

}
/**
 * 送货单查询 列表
 */
export function selectDeliveryOrder(begin_date, end_date, start = 0, rows = 10) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.SelectDeliveryOrdering_More_ACTION,
            api: types.SelectDeliveryOrder_API,
            param: { token, user_id,/* begin_date, end_date, */page, rows }
        };
    } else {
        return {
            type: types.SelectDeliveryOrdering_ACTION,
            api: types.SelectDeliveryOrder_API,
            param: { token, user_id,/* begin_date, end_date, */page, rows }
        };
    }

}
/**
 * 车余货 列表
 */
export function getCarstockProductList(carbaseinfo_id) {
    const user_id = LoginInfo.getUserInfo().user_id;
    const token = LoginInfo.getUserInfo().token;
    return {
        type: types.GetCarstockProductListing_ACTION,
        api: types.GetCarstockProductList_API,
        param: { token, user_id, carbaseinfo_id }
    };

}
//卸货数量修改
/**
 * 
 * @param {*产品ID} id 
 * @param {*卸货数量} count 
 */
export function getCarstockProductListDisburden(id, count) {
    const user_id = LoginInfo.getUserInfo().user_id;
    const token = LoginInfo.getUserInfo().token;
    return {
        type: types.GetCarstockProductListDisburden_ACTION,
        param: { token, id, count }
    };

}

//车牌号搜索
/**
 * 
 * @param {*产品ID} id 
 * @param {*卸货数量} count 
 */
export function selectCar(loadingdate) {
    const token = LoginInfo.getUserInfo().token;
    const organization_id = LoginInfo.getUserInfo().organization_id;
    return {
        type: types.SelectCaring_ACTION,
        api: types.SelectCar_API,
        param: { token, organization_id,loadingdate }
    };

}
//业务员搜索
/**
 * 
 * @param {*产品ID} id 
 * @param {*卸货数量} count 
 */
export function selectName() {
    const token = LoginInfo.getUserInfo().token;
    const organization_id = LoginInfo.getUserInfo().organization_id;
    return {
        type: types.SelectNameing_ACTION,
        api: types.SelectName_API,
        param: { token, organization_id }
    };

}
//仓库搜索
/**
 * 
 * @param {*产品ID} id 
 * @param {*卸货数量} count 
 */
export function selectStore() {
    const token = LoginInfo.getUserInfo().token;
    const organization_id = LoginInfo.getUserInfo().organization_id;
    return {
        type: types.SelectStoreing_ACTION,
        api: types.SelectStore_API,
        param: { token, organization_id }
    };

}
/**
 * 退货单查询 列表
 */
export function queryReturnLists(begin_date, end_date, start = 0, rows = 10) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    let page = 1;
    if (start) {
        page = start / rows + 1;
        return {
            type: types.QueryReturnListsing_More_ACTION,
            api: types.QueryReturnLists_API,
            param: { token, user_id, begin_date, end_date, page, rows }
        };
    } else {
        return {
            type: types.QueryReturnListsing_ACTION,
            api: types.QueryReturnLists_API,
            param: { token, user_id, begin_date, end_date, page, rows }
        };
    }

}
/**
 * 退货单查询 详情
 */
export function queryReturnDetail(return_id) {
    const token = LoginInfo.getUserInfo().token;

    return {
        type: types.QueryReturnDetailing_ACTION,
        api: types.QueryReturnDetail_API,
        param: { token, return_id }
    };

}

/**
 * 开提货单 产品列表查询
 */
export function addLadingbillsProduct(product_spell) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    const organization_id = LoginInfo.getUserInfo().organization_id;
    let param = { token, organization_id, user_id };
    if (product_spell) {
        param.product_spell = product_spell;
    }
    return {
        type: types.AddLadingbillsProducting_ACTION,
        api: types.AddLadingbillsProduct_API,
        param: param
    };

}
/**
 * 开提货单 保存接口
 */
export function saveLadingbillsProduct(param) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    const organization_id = LoginInfo.getUserInfo().organization_id;
    const org_pinyin = LoginInfo.getUserInfo().org_pinyin;

    let saveParam = { ...param, token, organization_id,org_pinyin, user_id };
    return {
        type: types.SaveLadingbillsProducting_ACTION,
        api: types.SaveLadingbillsProduct_API,
        param: saveParam
    };

}
/**
 * 用户登录
 */
// 用户登录
export const Login_API = "appLand/appUserland.page";
export const Logining_ACTION = 'Logining_ACTION';  //开始登陆
export const LoginError_ACTION = 'LoginError_ACTION'; //收到登陆结果
export const LoginSucceed_ACTION = 'LoginSucceed_ACTION'; //收到登陆结果

export const SendMsg_API = "appLand/buildRand.page";
export const SendMsging_ACTION = 'SendMsging_ACTION';  //开始登陆
export const SendMsgError_ACTION = 'SendMsgError_ACTION'; //收到登陆结果
export const SendMsgSucceed_ACTION = 'SendMsgSucceed_ACTION'; //收到登陆结果

export const Login4Msg_API = "appLand/appUserlandDX.page";
export const Login4Msging_ACTION = 'Login4Msging_ACTION';  //开始登陆
export const Login4MsgError_ACTION = 'Login4MsgError_ACTION'; //收到登陆结果
export const Login4MsgSucceed_ACTION = 'Login4MsgSucceed_ACTION'; //收到登陆结果

export const ListCustomers_API = "mobileServiceManager/customers/selectListCustomers.page";
export const ListCustomersing_ACTION = 'ListCustomersing_ACTION';  //开始登陆
export const ListCustomersError_ACTION = 'ListCustomersError_ACTION'; //收到登陆结果
export const ListCustomersSucceed_ACTION = 'ListCustomersSucceed_ACTION'; //收到登陆结果

// 提货单查询
export const SelectLadingbills_API = "mobileServiceManager/ladingbills/selectLadingbills.page";
export const SelectLadingbillsing_ACTION = 'SelectLadingbillsing_ACTION';  
export const SelectLadingbillsing_More_ACTION = 'SelectLadingbillsing_More_ACTION';  
export const SelectLadingbillsError_ACTION = 'SelectLadingbillsError_ACTION'; //收到结果
export const SelectLadingbillsSucceed_ACTION = 'SelectLadingbillsSucceed_ACTION'; //收到结果
// 订货单查询详细
export const PurchaseOrderDetail_API = "mobile_interfaces/mobile_info/getPurchaseOrderInfo.page";
export const PurchaseOrderDetailing_ACTION = 'PurchaseOrderDetailing_ACTION';  
export const PurchaseOrderDetailing_More_ACTION = 'PurchaseOrderDetailing_More_ACTION';  
export const PurchaseOrderDetailError_ACTION = 'PurchaseOrderDetailError_ACTION'; //收到结果
export const PurchaseOrderDetailSucceed_ACTION = 'PurchaseOrderDetailSucceed_ACTION'; //收到结果
// 订货单查询
export const PurchaseOrderInfo_API = "mobile_interfaces/mobile_info/getPurchaseOrderSummary.page";
export const PurchaseOrderInfoing_ACTION = 'PurchaseOrderInfoing_ACTION';  
export const PurchaseOrderInfoing_More_ACTION = 'PurchaseOrderInfoing_More_ACTION';  
export const PurchaseOrderInfoError_ACTION = 'PurchaseOrderInfoError_ACTION'; //收到结果
export const PurchaseOrderInfoSucceed_ACTION = 'PurchaseOrderInfoSucceed_ACTION'; //收到结果
// 送货单查询
export const SelectDeliveryOrder_API = "mobileServiceManager/deliveryNotes/selectDeliveryNotes.page";
export const SelectDeliveryOrdering_ACTION = 'SelectDeliveryOrdering_ACTION';  
export const SelectDeliveryOrdering_More_ACTION = 'SelectDeliveryOrdering_More_ACTION';  
export const SelectDeliveryOrderError_ACTION = 'SelectDeliveryOrderError_ACTION'; //收到结果
export const SelectDeliveryOrderSucceed_ACTION = 'SelectDeliveryOrderSucceed_ACTION'; //收到结果
// 送货单详情 mobileServiceManager/deliveryNotes/getDeliveryProductList.page?token=rc3GWySoPEF4aFrUgG&delivery_id=100072
export const DeliveryOrderDetail_API = "mobileServiceManager/deliveryNotes/getDeliveryProductList.page";
export const DeliveryOrderDetailing_ACTION = 'DeliveryOrderDetailing_ACTION';  
export const DeliveryOrderDetailing_More_ACTION = 'DeliveryOrderDetailing_More_ACTION';  
export const DeliveryOrderDetailError_ACTION = 'DeliveryOrderDetailError_ACTION'; //收到结果
export const DeliveryOrderDetailSucceed_ACTION = 'DeliveryOrderDetailSucceed_ACTION'; //收到结果
// 车余货列表
export const GetCarstockProductList_API = "mobile_interfaces/mobile_info/get_carstock_product_list.page";
export const GetCarstockProductListing_ACTION = 'GetCarstockProductListing_ACTION';  
export const GetCarstockProductListing_More_ACTION = 'GetCarstockProductListing_More_ACTION';  
export const GetCarstockProductListError_ACTION = 'GetCarstockProductListError_ACTION'; //收到结果
export const GetCarstockProductListSucceed_ACTION = 'GetCarstockProductListSucceed_ACTION'; //收到结果
export const GetCarstockProductListDisburden_ACTION = 'GetCarstockProductListDisburden_ACTION'; //卸货修改

// 车牌号搜索
export const SelectCar_API = "mobileServiceManager/ladingbills/appGetCarList.page";
export const SelectCaring_ACTION = 'SelectCaring_ACTION';  
export const SelectCarError_ACTION = 'SelectCarError_ACTION'; //收到结果
export const SelectCarSucceed_ACTION = 'SelectCarSucceed_ACTION'; //收到结果
// 业务员搜索
export const SelectName_API = "mobileServiceManager/ladingbills/appGetUserList.page";
export const SelectNameing_ACTION = 'SelectNameing_ACTION';  
export const SelectNameError_ACTION = 'SelectNameError_ACTION'; //收到结果
export const SelectNameSucceed_ACTION = 'SelectNameSucceed_ACTION'; //收到结果
// 仓库搜索
export const SelectStore_API = "mobileServiceManager/ladingbills/appGetWarehouse.page";
export const SelectStoreing_ACTION = 'SelectStoreing_ACTION';  
export const SelectStoreError_ACTION = 'SelectStoreError_ACTION'; //收到结果
export const SelectStoreSucceed_ACTION = 'SelectStoreSucceed_ACTION'; //收到结果

//退货单信息查询接口
export const QueryReturnLists_API = "mobile_interfaces/mobile_info/queryReturn_lists.page";
export const QueryReturnListsing_ACTION = 'QueryReturnListsing_ACTION';  
export const QueryReturnListsing_More_ACTION = 'QueryReturnListsing_More_ACTION';  
export const QueryReturnListsError_ACTION = 'QueryReturnListsError_ACTION'; //收到结果
export const QueryReturnListsSucceed_ACTION = 'QueryReturnListsSucceed_ACTION'; //收到结果
//退货单详情查询接口
export const QueryReturnDetail_API = "mobile_interfaces/mobile_info/get_return_product_list.page";
export const QueryReturnDetailing_ACTION = 'QueryReturnDetailing_ACTION';  
export const QueryReturnDetailing_More_ACTION = 'QueryReturnDetailing_More_ACTION';  
export const QueryReturnDetailError_ACTION = 'QueryReturnDetailError_ACTION'; //收到结果
export const QueryReturnDetailSucceed_ACTION = 'QueryReturnDetailSucceed_ACTION'; //收到结果


//开提货单产品列表
export const AddLadingbillsProduct_API = "mobileServiceManager/ladingbills/appGetProductList.page";
export const AddLadingbillsProducting_ACTION = 'AddLadingbillsProducting_ACTION';  
export const AddLadingbillsProducting_More_ACTION = 'AddLadingbillsProducting_More_ACTION';  
export const AddLadingbillsProductError_ACTION = 'AddLadingbillsProductError_ACTION'; //收到结果
export const AddLadingbillsProductSucceed_ACTION = 'AddLadingbillsProductSucceed_ACTION'; //收到结果

//开送货单获取产品
export const AddDeliveryOrder_API = "mobileServiceManager/deliveryNotes/getladingbillproductlist.page";
export const AddDeliveryOrdering_ACTION = 'AddDeliveryOrdering_ACTION';
export const AddDeliveryOrdering_More_ACTION = 'AddDeliveryOrdering_More_ACTION';  
export const AddDeliveryOrderError_ACTION = 'AddDeliveryOrderError_ACTION'; //收到结果
export const AddDeliveryOrderSucceed_ACTION = 'AddDeliveryOrderSucceed_ACTION'; //收到结果

export const AddDeliveryOrdering4Car_ACTION = 'AddDeliveryOrdering4Car_ACTION';//获取车牌
export const AddDeliveryOrder4CarSucceed_ACTION = 'AddDeliveryOrder4CarSucceed_ACTION';//获取车牌

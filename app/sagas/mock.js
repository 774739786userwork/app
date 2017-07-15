
/**
 * 订单详细
 * @param {*} start 
 * @param {*} page 
 */
function purchaseOrderDetail(start, page) {
    let item = {
        "purchase_date": "2017-05-02",
        "serial_number": "1605020021",
        "purchase_status": "未配送",
        "customer_id": "20015",
        "customer_name": "多邦建材",
        "customer_phone": "13874112255",
        "customer_address": "长沙市天心区暮云街道",
        "goodsStr": "【内墙（小）】\t170/包\n【外墙（普）】\t162/包\n【小桶108胶水】\t13/桶\n【内墙乳胶漆（小）】\t6/桶\n【康家108小胶】\t20/桶\n【KII防水（3.5KG/包+1.5KG/桶）】\t6/桶\n【新瓷砖胶】\t30/包\n【外墙腻子王】\t110/包\n【砂浆王】\t10/包\n【中国梦通用瓷砖胶】\t10/包\n【厨卫博士】\t4/桶\n"
    };
    let data = [];
    for (let i = 0; i < page; i++) {
        data.push(item);
    }
    return { result: 0, data };
}
/**
 * 订单详情
 * @param {*} start 
 * @param {*} page 
 */
function purchaseOrderInfo(start, page) {
    let item = {
        "product_name": "内耐水腻子",
        "product_quantity": "100",
        "product_price": "20.0",
        "product_sum": "200.0",
        "product_id": "33"
    }
        ;
    let data = []
    for (let i = 0; i < page; i++) {
        data.push(item);
    }
    return { result: 0, data };
}
/**
 * 送货单列表
 * @param {*} start 
 * @param {*} page 
 */
function employee_to_delivery_order(start, page) {
    let item = {
        "delivery_id": 16012,
        "delivery_date": "2017-05-02",
        "serial_number": "1605030140",
        "customer_id": 2017,
        "shop_name": "华润漆",
        "contacts_mobile": "15111010445",
        "customer_address": "天心区新开铺百姓建材市场1栋5号",
        "contacts_name": "万许捷",
        "total_sum": 2240,
        "unpaid_total_sum": 0,
        "count_small_change_sum": 0
    }
        ;
    let data = {
        "total_record": 11,
        "d_total_sum": 2780,
        "d_unpaid_total_sum": 0,
        "d_count_small_change_sum": 0.56,
        "delivery_note_number": 10,
        "delivery_order_list": []
    };
    for (let i = 0; i < page; i++) {
        data.delivery_order_list.push(item);
    }
    return { result: 0, data };
}
function get_delivery_product_list() {
    let item = {
        "id": 916310,
        "product_id": 20179,
        "product_name": "外墙抗裂腻子（敬天爱人）",
        "img_url": "/assets/images/products/0ead629e-ad30-11e6-b612-00163e00691c.jpg",
        "sale_quantity": 4,
        "price": "12.0",
        "gifts_quantity": 0,
        "sum": "48.0",
        "stock": 50,
        "total_foregift": "0.0"
    };
    let data = [];
    for (let i = 0; i < 10; i++) {
        data.push(item);
    }
    return { result: 0, data };
}
//mobile_interfaces/mobile_info/get_carstock_product_list.page
function get_carstock_product_list() {
    let data = {
        "good_list": [{
            "product_id": 33,
            "product_name": "内墙（大）",
            "product_specifications": "12.5KG/包",
            "product_unit": "包",
            "product_stock_quantity": 50,
            "sale_quantity": 0,
            "total_loading_quantity": "100"
        },
        {
            "product_id": 34,
            "product_name": "外墙（小）",
            "product_specifications": "12.5KG/包",
            "product_unit": "包",
            "product_stock_quantity": 1000,
            "sale_quantity": 0,
            "total_loading_quantity": "100"
        }, 
        {
            "product_id": 35,
            "product_name": "内墙（大）",
            "product_specifications": "12.5KG/包",
            "product_unit": "包",
            "product_stock_quantity": 5000,
            "sale_quantity": 0,
            "total_loading_quantity": "100"
        },
        {
            "product_id": 36,
            "product_name": "内墙（大）",
            "product_specifications": "12.5KG/包",
            "product_unit": "包",
            "product_stock_quantity": 40000,
            "sale_quantity": 0,
            "total_loading_quantity": "100"
        }]
    }
    return { result: 0, data };
}
function queryReturn_lists() {
    let data = [
        {
            "id": 3131,
            "serial_number": "1705090001",
            "saler_id": 20035,
            "saler_name": "罗连贵",
            "return_date": "2017-05-09",
            "customer_id": 22571,
            "car_number": "湘AUE742",
            "status": "未审核",
            "create_user_id": 20073,
            "return_reson": "fbjhjj",
            "return_total_sum": 525,
            "foregift": "0.0",
            "create_person": "罗连贵",
            "customerid": 22571,
            "customername": "嘉宝莉",
            "customerphone": "15675277188",
            "customeraddress": "花石镇中心加油站隔壁"
        }];
    return { result: 0, data };
}

/**
 * 订单详情
 * @param {*} start 
 * @param {*} page 
 */
function get_return_product_list(start, page) {
    let item = {
        "quantity": 5,
        "price": 105,
        "gift_quantity": 6,
        "product_sum": 525,
        "product_id": 5,
        "product_name": "KII（中）红",
        "product_foregift": "0.0",
        "img_url": "/assets/images/products/5.png"
    };
    let data = []
    for (let i = 0; i < 3; i++) {
        data.push(item);
    }
    return { result: 0, data };
}

export default function mock(api, param) {
    console.log('mock-->' + api + '---param->' + param);
    let data = {};
    if ("mobile_interfaces/mobile_info/getPurchaseOrderInfo.page" === api) {
        data = purchaseOrderDetail(0, 20);
    } else if ("mobile_interfaces/mobile_info/getPurchaseOrderSummary.page" === api) {
        data = purchaseOrderInfo(0, 20);
    } else if ("mobile_interfaces/mobile_info/employee_to_delivery_order" === api) {
        data = employee_to_delivery_order(0, 20);
    } else if ("mobile_interfaces/mobile_info/get_delivery_product_list.page" === api) {
        data = get_delivery_product_list();
    }
    else if ("mobile_interfaces/mobile_info/get_carstock_product_list.page" === api) {
        data = get_carstock_product_list();
    }
    else if ("mobile_interfaces/mobile_info/queryReturn_lists.page" === api) {
        data = queryReturn_lists();
    } else if ("mobile_interfaces/mobile_info/get_return_product_list.page" === api) {
        data = get_return_product_list();
    }
    return data
}
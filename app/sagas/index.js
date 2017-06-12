import { fork } from 'redux-saga/effects';
import { watchRequestLogin } from './login'
import { watchSelectLadingbills } from './selectLadingbills'
import { watchPurchaseOrderDetail } from './purchaseOrderDetail'
import { watchPurchaseOrderInfo } from './purchaseOrderInfo'
import { watchSelectDeliveryOrder } from './selectDeliveryOrder'
import { watchDeliveryOrderDetail } from './deliveryOrderDetail'
import { watchGetCarstockProductList } from './getCarstockProductList'
import { watchRequestSelectCar } from './selectCar'
import { watchRequestSelectName } from './selectName'
import { watchQueryReturnLists } from './queryReturnLists'
import { watchQueryReturnDetail } from './queryReturnDetail'
import { watchRequestSelectStore } from './selectStore'
import { watchAddLadingbillsProduct } from './addLadingbillsProduct'
import { watchLogin4msg } from './login4msg'
import { watchRequestListCustomers } from './listCustomers'
import { watchAddDeliveryOrder } from './addDeliveryOrder'
import { watchSaveLadingbillsProduct } from './saveLadingbillsProduct'

export default function* rootSaga() {
    yield [
        fork(watchRequestLogin),
        fork(watchSelectLadingbills),
        fork(watchPurchaseOrderDetail),
        fork(watchPurchaseOrderInfo),
        fork(watchSelectDeliveryOrder),
        fork(watchDeliveryOrderDetail),
        fork(watchGetCarstockProductList),
        fork(watchRequestSelectCar),
        fork(watchQueryReturnLists),
        fork(watchQueryReturnDetail),
        fork(watchRequestSelectName),
        fork(watchRequestSelectStore),
        fork(watchAddLadingbillsProduct),
        fork(watchLogin4msg),
        fork(watchRequestListCustomers),
        fork(watchAddDeliveryOrder),
        fork(watchSaveLadingbillsProduct),
    ];
}
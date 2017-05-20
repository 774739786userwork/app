import { fork } from 'redux-saga/effects';
import { watchRequestLogin } from './login'
import { watchSelectLadingbills } from './selectLadingbills'
import { watchPurchaseOrderDetail } from './purchaseOrderDetail'
import { watchPurchaseOrderInfo } from './purchaseOrderInfo'
import { watchSelectDeliveryOrder } from './selectDeliveryOrder'
import { watchDeliveryOrderDetail } from './deliveryOrderDetail'


export default function* rootSaga() {
    yield [
        fork(watchRequestLogin),
        fork(watchSelectLadingbills),
        fork(watchPurchaseOrderDetail),
        fork(watchPurchaseOrderInfo),
        fork(watchSelectDeliveryOrder),
         fork(watchDeliveryOrderDetail),
    ];
}
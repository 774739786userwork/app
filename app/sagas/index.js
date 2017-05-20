import { fork } from 'redux-saga/effects';
import { watchRequestLogin } from './login'
import { watchSelectLadingbills } from './selectLadingbills'
import { watchPurchaseOrderDetail } from './purchaseOrderDetail'
import { watchPurchaseOrderInfo } from './purchaseOrderInfo'



export default function* rootSaga() {
    yield [
        fork(watchRequestLogin),
        fork(watchSelectLadingbills),
        fork(watchPurchaseOrderDetail),
        fork(watchPurchaseOrderInfo),
    ];
}
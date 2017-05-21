import { combineReducers } from 'redux';
import login from './loginReducer';
import selectLadingbills from './selectLadingbillsReducer'
import purchaseOrderDetail from './purchaseOrderDetailReducer'
import purchaseOrderInfo from './purchaseOrderInfoReducer'
import selectDeliveryOrder from './selectDeliveryOrderReducer'
import deliveryOrderDetail from './deliveryOrderDetailReducer'
import getCarstockProductList from './getCarstockProductListReducer'
import selectCar from './selectCarReducer'
const rootReducer = combineReducers({
  login,
  selectLadingbills,
  purchaseOrderDetail,
  purchaseOrderInfo,
  selectDeliveryOrder,
  deliveryOrderDetail,
  getCarstockProductList,
  selectCar
});

export default rootReducer;
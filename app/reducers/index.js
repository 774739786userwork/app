import { combineReducers } from 'redux';
import login from './loginReducer';
import selectLadingbills from './selectLadingbillsReducer'
import purchaseOrderDetail from './purchaseOrderDetailReducer'
import purchaseOrderInfo from './purchaseOrderInfoReducer'
import selectDeliveryOrder from './selectDeliveryOrderReducer'
import deliveryOrderDetail from './deliveryOrderDetailReducer'
import getCarstockProductList from './getCarstockProductListReducer'
import selectCar from './selectCarReducer'
import selectName from './selectNameReducer'
import selectStore from './selectStoreReducer'
import queryReturnLists from './queryReturnListsReducer'
import queryReturnDetail from './queryReturnDetailReducer'
import addLadingbillsProduct from './addLadingbillsProductReducer'
import sendMsg from './sendMsgReducer'
import listCustomers from './listCustomersReducer'
import addDeliveryOrder from './addDeliveryOrderReducer'

const rootReducer = combineReducers({
  login,
  selectLadingbills,
  purchaseOrderDetail,
  purchaseOrderInfo,
  selectDeliveryOrder,
  deliveryOrderDetail,
  getCarstockProductList,
  selectCar,
  queryReturnLists,
  queryReturnDetail,
  selectName,
  selectStore,
  addLadingbillsProduct,
  sendMsg,
  listCustomers,
  addDeliveryOrder
});

export default rootReducer;
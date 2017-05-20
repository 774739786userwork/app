import { combineReducers } from 'redux';
import login from './loginReducer';
import selectLadingbills from './selectLadingbillsReducer'
import purchaseOrderDetail from './purchaseOrderDetailReducer'
import purchaseOrderInfo from './purchaseOrderInfoReducer'

const rootReducer = combineReducers({
  login,
  selectLadingbills,
  purchaseOrderDetail,
  purchaseOrderInfo
});

export default rootReducer;
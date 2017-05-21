import { StackNavigator, TabNavigator } from 'react-navigation';

import SplashPage from '../pages/SplashPage';
//工作台
import WorkContainer from '../containers/WorkContainer';
//提货单查询
import SelectLadingbillsContainer from './work/SelectLadingbillsContainer';
import PurchaseOrderInfoContainer from './work/PurchaseOrderInfoContainer';
//送货单查询
import SelectDeliveryOrderContainer from './work/SelectDeliveryOrderContainer'
import DeliveryOrderDetailContainer from './work/DeliveryOrderDetailContainer'
//车余货
import GetCarstockProductListContainer from './work/GetCarstockProductListContainer'
//销售管理
import SelasContainer from './SelasContainer';
//客户管理
import CustContainer from './CustContainer';
//设置
import SettingContainer from './SettingContainer';
//登录
import LoginContainer from './login/LoginContainer'

const TabContainer = TabNavigator(
  {
    Work: { screen: WorkContainer },
    Selas: { screen: SelasContainer },
    Cust: { screen: CustContainer },
    Setting: { screen: SettingContainer }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#0081d4',
      inactiveTintColor: '#666666',
      showIcon: true,
      style: {
        backgroundColor: '#fff'
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0
      }
    }
  }
);

const App = StackNavigator(
  {
    Splash: { screen: SplashPage },
    Login: { screen: LoginContainer },
    Home: {
      screen: TabContainer,
      navigationOptions: {
        headerLeft: null
      }
    },
    SelectLadingbills: {
      screen: SelectLadingbillsContainer
    },
    PurchaseOrderInfo: {
      screen: PurchaseOrderInfoContainer
    },
    SelectDeliveryOrder: {
      screen: SelectDeliveryOrderContainer
    },
    DeliveryOrderDetail: {
      screen: DeliveryOrderDetailContainer
    },
    GetCarstockProductList: {
      screen: GetCarstockProductListContainer
    },
    
    
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0081d4'
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 20,
      },
      headerTintColor: '#fff'
    }
  }
);

export default App;
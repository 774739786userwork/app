import { StackNavigator, TabNavigator } from 'react-navigation';

import SplashPage from '../pages/SplashPage';
//工作台
import WorkContainer from '../containers/WorkContainer';
//提货单查询
import SelectLadingbillsContainer from './work/SelectLadingbillsContainer';
//订货单查询
import PurchaseOrderInfoContainer from './work/PurchaseOrderInfoContainer';
//送货单查询
import SelectDeliveryOrderContainer from './work/SelectDeliveryOrderContainer'
//开送货单  客户查询
import ListCustomersContainer from './work/ListCustomersContainer'
import AddDeliveryOrderContainer from './work/AddDeliveryOrderContainer'

import DeliveryOrderDetailContainer from './work/DeliveryOrderDetailContainer'
//车余货
import GetCarstockProductListContainer from './work/GetCarstockProductListContainer'
//车辆选择
import SelectCarContainer from './select/SelectCarContainer'
//业务员 选择
import SelectNameContainer from './select/SelectNameContainer'
//仓库查询
import SelectStoreContainer from './select/SelectStoreContainer'
//退货查询
import QueryReturnListsContainer from './work/QueryReturnListsContainer'
import QueryReturnDetailContainer from './work/QueryReturnDetailContainer'
//开提货单
import AddLadingbillsContainer from './work/AddLadingbillsContainer'
import AddLadingbillsProductContainer from './work/AddLadingbillsProductContainer'

//销售管理
import SelasContainer from './SelasContainer';
//客户管理
import CustContainer from './CustContainer';
//新增客户
import AddCustContainer from './cust/AddCustContainer'
//设置
import SettingContainer from './SettingContainer';
//登录
import LoginContainer from './login/LoginContainer'
//密码验证
import Login4MsgContainer from './login/Login4MsgContainer'
//关于
import AboutPageContainer from './setting/AboutPageContainer'
//修改密码
import ForgetPassWordContainer from './setting/ForgetPassWordContainer'

import QRPage from '../pages/QRPage'

const TabContainer = TabNavigator(
  {
    Work: { screen: WorkContainer },
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
    Login4Msg: { screen: Login4MsgContainer },
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
    SelectCar: {
      screen: SelectCarContainer
    },
    SelectName: {
      screen: SelectNameContainer
    },
    SelectStore: {
      screen: SelectStoreContainer
    },

    QueryReturnLists: {
      screen: QueryReturnListsContainer
    },
    QueryReturnDetail: {
      screen: QueryReturnDetailContainer
    },
    AddLadingbills: {
      screen: AddLadingbillsContainer
    },
    AddLadingbillsProduct: {
      screen: AddLadingbillsProductContainer
    },
    AboutPage: {
      screen: AboutPageContainer
    },
    ForgetPassWord: {
      screen: ForgetPassWordContainer
    },
    QR: {
      screen: QRPage
    },
    ListCustomers: {
      screen: ListCustomersContainer
    },
    AddDeliveryOrder: {
      screen: AddDeliveryOrderContainer
    },
    AddCust: {
      screen: AddCustContainer
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
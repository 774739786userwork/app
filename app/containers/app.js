import { StackNavigator, TabNavigator } from 'react-navigation';

import SplashPage from '../pages/SplashPage';

import SettingUrlPage from '../pages/SettingUrlPage';
//工作台
import WorkContainer from '../containers/WorkContainer';
//提货单查询
import SelectLadingbillsContainer from './work/SelectLadingbillsContainer';
import SelectLadingbillsDetailPage from '../pages/work/SelectLadingbillsDetailPage'
//卸货单
import UnloadBillContainer from './work/UnloadBillContainer';
//卸货单查询
import UnLoadBillDetailListContainer from './work/UnLoadBillDetailListContainer'
//开退货单
import NewReturnGoodContainer from './work/returnGood/NewReturnGoodContainer'
//退货单产品列表
import ReturnGoodListContainer from './work/returnGood/ReturnGoodListContainer'

import ReturnGoodComfirmContainer from './work/returnGood/ReturnGoodComfirmContainer'
//订货单查询
import PurchaseOrderInfoContainer from './work/PurchaseOrderInfoContainer';
//送货单查询
import SelectDeliveryOrderContainer from './work/SelectDeliveryOrderContainer'
//开送货单  客户查询
import ListCustomersContainer from './work/ListCustomersContainer'
import AddDeliveryOrderContainer from './work/AddDeliveryOrderContainer'
//开送货单结算
import AddDeliveryOrderEndPageContainer from './work/AddDeliveryOrderEndPageContainer'
//开订货单
import PurchaseOrderContainer from './work/PurchaseOrderContainer'

import DeliveryOrderDetailContainer from './work/DeliveryOrderDetailContainer'
//车存货
import GetCarstockProductListContainer from './work/GetCarstockProductListContainer'
//车余货
import GetCarSurplusGoodsListContainer from './work/GetCarSurplusGoodsListContainer';
//车辆选择
import SelectCarContainer from './select/SelectCarContainer'
//车辆选择  不需要请求数据
import ShowSelectCarPage from '../pages/select/ShowSelectCarPage'
//客户选择
import SelectCustomersContainer from './select/SelectCustomersContainer'
//业务员 选择
import SelectNameContainer from './select/SelectNameContainer'
//计量人 选择
import SelectUserContainer from './select/SelectUserContainer'
//输入框输入
import SelectInputContainer from './select/SelectInputContainer'
//仓库查询
import SelectStoreContainer from './select/SelectStoreContainer'
//退货查询
import QueryReturnListsContainer from './work/QueryReturnListsContainer'
import QueryReturnDetailContainer from './work/QueryReturnDetailContainer'
//开提货单
import AddLadingbillsContainer from './work/AddLadingbillsContainer'
import AddLadingbillsProductContainer from './work/AddLadingbillsProductContainer'
//开订货单
import AddPurchaseOrderContainer from './work/purchaseorder/AddPurchaseOrderContainer'
//开结算单
import AddBalanceAccoutsContainer from './work/AddBalanceAccoutsContainer'
//销售管理
import SelasContainer from './SelasContainer';
//客户管理
import CustContainer from './CustContainer';
//新增客户
import AddCustContainer from './cust/AddCustContainer'
import DeliveryCustomersContainer from './cust/DeliveryCustomersContainer'
import CustDetailContainer from './cust/CustDetailContainer'
import CustContactContainer from './cust/CustContactContainer'
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
import BleManagerPage from '../pages/setting/BleManagerPage'
import ScanManagerPage from '../pages/setting/ScanManagerPage'

import WebViewContainer from './WebViewContainer'
/**** 统计分析  *** */
//首页
import S_HomeContainer from './analysis/S_HomeContainer'
//统计分析 日 各厂详情
import S_DayDetailPage from './analysis/home/S_DayDetailPage'
import S_HomeDetailPage from './analysis/home/S_HomeDetailPage'
//系列
import S_SeriesContainer from './analysis/S_SeriesContainer'
//产品
import S_ProductContainer from './analysis/S_ProductContainer'
import S_ProductDetailContainer from './analysis/product/S_ProductDetailContainer'
//顾客
import S_CustomerContainer from './analysis/S_CustomerContainer'

import QRPage from '../pages/QRPage'

const AnalysisTabContainer = TabNavigator(
  {
    S_Home: { screen: S_HomeContainer },
 //   S_Series: { screen: S_SeriesContainer },
  //  S_Product: { screen: S_ProductContainer },
    Cust: { screen: CustContainer },
    Setting: { screen: SettingContainer }
  },
  {
    lazy: true,
    animationEnabled: false,
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
    SettingUrl: { screen: SettingUrlPage },
    Login: { screen: LoginContainer },
    Login4Msg: { screen: Login4MsgContainer },
    Home: {
      screen: TabContainer,
      navigationOptions: {
        headerLeft: null
      }
    },
    Analysis: {
      screen: AnalysisTabContainer,
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
    GetCarSurplusGoodsList:{
      screen:GetCarSurplusGoodsListContainer
    },
    SelectCar: {
      screen: SelectCarContainer
    },
    SelectName: {
      screen: SelectNameContainer
    },
    SelectStore: {
      screen: SelectStoreContainer
    },//
    SelectInput: {
      screen: SelectInputContainer
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
    AddDeliveryOrderEnd: {
      screen: AddDeliveryOrderEndPageContainer
    },
    SelectUser: {
      screen: SelectUserContainer
    },
    DeliveryCustomers: {
      screen: DeliveryCustomersContainer
    },
    SelectLadingbillsDetail: {
      screen: SelectLadingbillsDetailPage
    },
    ShowSelectCar: {
      screen: ShowSelectCarPage
    },
    BleManager: {
      screen: BleManagerPage
    },
    ScanManager: {
      screen: ScanManagerPage
    },
    CustDetail: {
      screen: CustDetailContainer
    },

    CustContact:{
      screen: CustContactContainer
    },
    AddBalanceAccouts: {
      screen: AddBalanceAccoutsContainer
    },
    //卸货单
    UnloadBill: {
      screen: UnloadBillContainer
    },
    UnLoadBillDetailList: {
      screen: UnLoadBillDetailListContainer
    },
    NewReturnGood: {
      screen: NewReturnGoodContainer
    },
    SelectCustomers: {
      screen: SelectCustomersContainer
    },
    ReturnGoodList: {
      screen: ReturnGoodListContainer
    },
    ReturnGoodComfirm: {
      screen: ReturnGoodComfirmContainer
    },
    PurchaseOrder: {
      screen: PurchaseOrderContainer
    },
    AddPurchaseOrderList: {
      screen: AddPurchaseOrderContainer
    },
    WebView: {
      screen: WebViewContainer
    },
    S_DayDetail: {
      screen: S_DayDetailPage
    },
    S_HomeDetail: {
      screen: S_HomeDetailPage
    },
    S_ProductDetail: {
      screen: S_ProductDetailContainer
    }

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
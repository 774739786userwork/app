import { StackNavigator, TabNavigator } from 'react-navigation';

import SplashPage from '../pages/SplashPage';

import WorkContainer from '../containers/WorkContainer';
import SelasContainer from '../containers/SelasContainer';
import CustContainer from '../containers/CustContainer';
import SettingContainer from '../containers/SettingContainer';
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
    Login:{screen:LoginContainer},
    Home: {
      screen: TabContainer,
      navigationOptions: {
        headerLeft: null
      }
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
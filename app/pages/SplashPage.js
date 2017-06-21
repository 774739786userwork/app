
import React from 'react';

import {
  Dimensions,
  Image
} from 'react-native';

import {
  FetchManger,
  LoginInfo
} from 'react-native-go'

import NavigationUtil from '../utils/NavigationUtil';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const splashImg = require('../imgs/splash.png');

class SplashPage extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    const { navigate } = this.props.navigation;
    let baseUrl = global.baseUrl;
    FetchManger.initConfig({ baseUrl, expiry: 60 });
    LoginInfo.loadUserInfo();
    
    this.timer = setTimeout(() => {
      if (LoginInfo.getUserInfo() && LoginInfo.getUserInfo().user_id) {
        NavigationUtil.reset(this.props.navigation, 'Home');
      } else {
        NavigationUtil.reset(this.props.navigation, 'Login');
      }
    }, 1000);


  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <Image
        style={{
          width: maxWidth,
          height: maxHeight,
        }}
        source={splashImg}
      />
    );
  }
}

export default SplashPage;

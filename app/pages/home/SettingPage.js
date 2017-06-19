

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Navigator,
  TouchableHighlight,
  ListView,
  TouchableOpacity,
  View,
  InteractionManager
} from 'react-native';

import NavigationUtil from '../../utils/NavigationUtil';


import ListItemSetting from '../../components/ListItemSetting';
import HomeBar from '../../components/HomeBar'
import { Iconfont, LoginInfo,FetchManger } from 'react-native-go';

var WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f2f2f2',

  },
  container: {
    flex: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#047DE6',

  },
  header_title: {
    color: 'white',
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  centerView: {
    flex: 1,

  },
  bgimage: {
    height: 130,
    width: WINDOW_WIDTH,
    backgroundColor: '#53c3fe',
  },
  centerimage: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    marginTop: 30,
    alignSelf: 'center',


  },
  userIcon: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    marginTop: 16,
    alignSelf: 'center',
  },
  nametitle: {
    fontSize: 20,
    marginTop: 8,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  styletitle: {
    fontSize: 14,
    marginTop: 8,
    backgroundColor: 'transparent',
    color: '#63839e',
  },
  emptyview: {
    backgroundColor: '#ECEDEF',
    height: 10,
  },
  menuView: {
    flexDirection: 'row',

  },
  listview: {
    flexDirection: 'column',
  },
});

class SettingPage extends React.Component {

  constructor(props) {
    super(props);
    this.onAboutAction = this.onAboutAction.bind(this);
    this.onLoginOut = this.onLoginOut.bind(this);
    this.onUpdatePWDAction = this.onUpdatePWDAction.bind(this)
  }

  onAboutAction() {
    const { navigation } = this.props;
    navigation.navigate('AboutPage')
  }
  onUpdatePWDAction() {
    const { navigation } = this.props;
    navigation.navigate('ForgetPassWord')
  }
  onLoginOut() {
    
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    FetchManger.postUri('mobileServiceManager/user/signOut.page', {user_id,token})
    InteractionManager.runAfterInteractions(() => {
      LoginInfo.loginOut();
      NavigationUtil.reset(this.props.navigation, 'Login');
    });
  }
  onUpdateAction() {

  }
  onBlueAction() {

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <HomeBar title='设 置' navigator={this.props.navigator} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyview}></View>
          <ListItemSetting
            icon='e6ae'
            iconColor='#f74171'
            onPress={this.onUpdatePWDAction}
            showText='密码修改' />
          <ListItemSetting
            icon='e6b6'
            iconColor='#f9ae0f'
            onPress={this.onBlueAction}
            showText='蓝牙打印' />
          <ListItemSetting
            icon='e6b0'
            iconColor='#18c5c0'
            onPress={this.onUpdateAction}
            showText='检查更新' />
          <ListItemSetting
            icon='e693'
            iconColor='#3abaf8'
            onPress={this.onAboutAction}
            showText='关于' />

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d4d4d4', marginTop: 20 }} />
          <TouchableOpacity onPress={this.onLoginOut}
            underlayColor={'#999'}
            style={{ height: 44, width: WINDOW_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, color: '#0081d4', }}>退出登录</Text>
          </TouchableOpacity >
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d4d4d4', }} />

        </ScrollView>
      </View >
    );
  }
}

export default SettingPage;

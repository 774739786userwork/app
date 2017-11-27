import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  InteractionManager
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MonthPicker from '../../components/MonthPicker'
import * as DateUtils from '../../utils/DateUtils'
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LeftTabComponet from './LeftTabComponet'
import TableRow from './TableRow'
import S_YearyPage from './home/S_YearyPage'
import S_MonthPage from './home/S_MonthPage'
import S_DayPage from './home/S_DayPage'

class S_HomeContainer extends React.Component {
  static navigationOptions = {
    title: '销售统计',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e7a7' iconSize={22} iconColor={tintColor} />
    ),
  };

  renderTabBar(tab) {
    let color0 = tab.activeTab == 0 ? "#fff" : "#0081d4";
    let tColor0 = tab.activeTab == 0 ? "#0081d4" : "#fff";
    let color1 = tab.activeTab == 1 ? "#fff" : "#0081d4"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor1 = tab.activeTab == 1 ? "#0081d4" : "#fff";
    let color2 = tab.activeTab == 2 ? "#fff" : "#0081d4"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor2 = tab.activeTab == 2 ? "#0081d4" : "#fff";


    return (
      <View style={{
        height: 48, backgroundColor: '#0081d4', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', elevation: 5,
      }}>
        <View style={{ flex: 1 }} />
        <View style={styles.tabs}>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(0)} style={styles.tab}>
            <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
              <Text style={{ color: tColor0 }}>
                年
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(1)} style={styles.tab}>
            <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
              <Text style={{ color: tColor1 }}>
                月
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(2)} style={styles.tab}>
            <View style={[styles.tabItem2, { backgroundColor: color2 }]} >
              <Text style={{ color: tColor2 }}>
                日
							</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );

  }

  render() {
    let iosTop = Platform.OS === 'ios' ? 20 : 0;
    return (<View style={{ flex: 1 }}>
              <View style={{ height: iosTop, backgroundColor: '#0081d4' }} />
              <ScrollableTabView locked={true} initialPage={1} renderTabBar={this.renderTabBar} >
                <S_YearyPage key={'0'} {...this.props} tabLabel={'year'}/>
                <S_MonthPage key={'1'}  {...this.props} tabLabel={'month'}/>
                <S_DayPage key={'2'} {...this.props} tabLabel={'day'}/>
              </ScrollableTabView>
            </View>)
  }
}

const styles = StyleSheet.create({
  iconStyle: {
    width: 26,
    height: 26,
  },
  textStyle: {
    color: '#666',
    marginBottom: 6,
  },
  selectedTextStyle: {
    color: '#42beff',
    marginBottom: 6,
  }, tabs: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 180,
    flexDirection: 'row',
  },
  tab: {
    height: 30,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem0: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 34,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,

  },
  tabItem1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 34,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabItem2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 34,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

});
export default S_HomeContainer;

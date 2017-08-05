import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
  InteractionManager,
  ScrollView
} from 'react-native';

import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LeftTabComponet from './LeftTabComponet'

import TableRow from './TableRow'


class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.goToPage = this.goToPage.bind(this)
    this.state = {
      activeTab: 0,
      data: [],
      selectItem: undefined
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getDayFactory.page', {}).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data.dayList;
          this.setState({ data })
        }
      }).catch((error) => {

      })
    });
  }

  goToPage(activeTab) {
    this.setState({ activeTab })
  }
  renderTabBar() {
    let activeTab = this.state.activeTab
    let color0 = activeTab == 0 ? "#fff" : "#0081d4";
    let tColor0 = activeTab == 0 ? "#0081d4" : "#fff";
    let color1 = activeTab == 1 ? "#fff" : "#0081d4"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor1 = activeTab == 1 ? "#0081d4" : "#fff";

    return (
      <View style={{
        height: 48, backgroundColor: '#0081d4', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', elevation: 5,
      }}>
        <View style={{ flex: 1 }} />
        <View style={styles.tabs}>
          <TouchableWithoutFeedback onPress={() => this.goToPage(0)} style={styles.tab}>
            <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
              <Text style={{ color: tColor0 }}>
                年
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.goToPage(1)} style={styles.tab}>
            <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
              <Text style={{ color: tColor1 }}>
                月
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

    let listData = this.state.data;
    let selectItem = this.state.selectItem;
    if (!selectItem) {
      selectItem = {}
      if (listData[0]) {
        selectItem = listData[0].salerList[0]
      }
    }
    let factoryList = [];
    if (selectItem && selectItem.factoryList) {
      factoryList = selectItem.factoryList
    }

    return (<View style={{ flex: 1 }}>
      <View style={{ height: iosTop, backgroundColor: '#0081d4' }} />
      {
        this.renderTabBar()
      }
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
        <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LeftTabComponet
            data={listData}
            sectionAction={(item) => {
              this.setState({ selectItem: item.salerList[0] })
            }}
          />
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${selectItem.cusUnReceiverSum}`}</Text>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${selectItem.cusUnReceiverSum}`}</Text>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${selectItem.cusUnReceiverSum}`}</Text>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${selectItem.cusUnReceiverSum}`}</Text>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum}`}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
            <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{`${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${selectItem.cusUnReceiverSum}`}</Text>
          </View>
          <Text style={{ color: '#666', marginLeft: 12, marginTop: 12, fontSize: 12 }}>{'未带新品情况'}</Text>
          <View style={{ backgroundColor: '#fff', margin: 12 }}>
            <TableRow bg={'#17c6c1'} tColor={'#fff'} t0={'工厂'} t1={'人数'} t2={'占比'} />
            {
              factoryList.map((item) => <TableRow bg={'#fff'} tColor={'#666'} t0={item.orgName} t1={item.personNumber} t2={item.proportion} />)
            }
          </View>
        </ScrollView>
      </View >
    </View >
    );
  }
}

class S_SeriesContainer extends React.Component {
  static navigationOptions = {
    title: '系列',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e724' iconSize={24} iconColor={tintColor} />
    ),
  };

  render() {
    return <S_SeriesPage {...this.props} />;
  }
}


const styles = StyleSheet.create({
  tabs: {
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
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

});


export default S_SeriesContainer;

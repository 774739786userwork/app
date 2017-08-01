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

class S_HomePage extends React.Component {
  constructor(props) {
    super(props);
    let { year, month } = DateUtils.yearMonth()
    //"yearTotalSum":"4377.0","yearUnReceiveSum":"404.0"
    this.state = {
      selY: year,
      selM: month,
      yearTotalSum: 0.00,
      yearUnReceiveSum: 0.00,
      yearFactory: [],
      charList: []
    }
  }
  componentDidMount() {
    let year = '2017'
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearAll.page', { year }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ ...data })
        }
      }).catch((error) => {

      })
    });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearFactory.page', { year }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ yearFactory: data })
        }
      }).catch((error) => {

      })
    });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearFactoryChart.page', { year }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ charList: data })
        }
      }).catch((error) => {

      })
    });
  }
  render() {
    let yearData = [];
    let yearFactory = this.state.yearFactory
    for (var i = 0; i < yearFactory.length; i++) {
      if (i < 3) {
        let item = yearFactory[i];
        yearData.push(item)
      }
    }
    let charList = this.state.charList
    let seriesData = [];
    const option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          interval: 'auto'
        },
        axisTick: {
          show: 'false',
          alignWithLabel: true
        },
        //x轴数据
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      yAxis: {},
      color: ['#ee5f8f', '#e8ba00', '#33cc99'],//自定义线条颜色，你可以设置多个颜色，使用时默认从第一个开始   如果不设置color则有它默认颜色
      // series里面的数据  如果是固定的线条 你只需要改变data数据就ok  
      // 如果不是确定有多少折线  建议吧整个serise数据替换掉   例如：series:[{...}{...}{...},...]配置项和下面一样
      series: [{
        name: 'NLU',
        type: 'line',
        data: seriesData[0],
        areaStyle: {
          normal: {
            color: '#0ffdeff4'
          }
        }
      },
      {
        name: 'WEU',
        type: 'line',
        data: seriesData[1],
        areaStyle: {
          normal: {
            color: '#0ffdf8e5'
          }
        }
      },
      {
        name: 'WEU1',
        type: 'line',
        data: seriesData[2],
        areaStyle: {
          normal: {
            color: '#0feafaf5'
          }
        }
      }]
    };
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{
          paddingTop: 8,
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          flexDirection: 'row'
        }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {

          }}>
            <Iconfont
              icon={'e688'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <MonthPicker
            style={{ width: 120 }}
            customStyles={{
              dateText: {
                fontSize: 18,
                color: '#000',
              }
            }}
            selY={this.state.selY}
            selM={this.state.selM}
            onDateChange={(selY, selM, ymStr) => {

            }}
          />
          <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {

          }}>
            <Iconfont
              icon={'e657'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: '#f9f9f9',
          paddingTop: 12,
          paddingBottom: 12
        }}>
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ lineHeight: 24, marginLeft: 4, color: '#17c6c1', fontSize: 20 }}>{`${this.state.yearTotalSum}万`}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'未收'}</Text>
            <Text style={{ lineHeight: 24, marginLeft: 4, color: '#f80000', fontSize: 20 }}>{`${this.state.yearUnReceiveSum}万`}</Text>
          </View>
        </View>
        <View style={{
          paddingTop: 12,
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#dedede' }}>
            {
              yearData.map((item) => <View >
                <View style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  padding: 12
                }} key={`row_${item}`}>
                  <Text style={{ color: '#333', flex: 1 }}>{item.orgName}</Text>

                  <Text style={{ color: '#666' }}>{'总销售额'}</Text>
                  <Text style={{ marginLeft: 4, width: 68, color: '#17c6c1' }}>{`${item.factoryTotalSum}万`}</Text>
                  <Text style={{ color: '#666' }}>{'未收'}</Text>
                  <Text style={{ marginLeft: 4, width: 50, color: '#f80000' }}>{`${item.factoryUnReceiveSum}万`}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }}></View>
              </View>)
            }
          </View>
        </View>
        <View style={{
          marginLeft: 12,
          marginRight: 12,
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          flexDirection: 'row'
        }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {
          }}>
            <Text style={{ padding: 12, color: '#999' }}>{'点击查看更多'}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <Echarts option={option} height={300} />
      </View >
    );
  }
}
class S_MonthPage extends React.Component {
  constructor(props) {
    super(props);
    let { year, month } = DateUtils.yearMonth()
    this.state = {
      selY: year, selM: month,
      yearTotalSum: 0.00,
      yearUnReceiveSum: 0.00,
      yearFactory: [],
      charList: []
    }
  }
  componentDidMount() {
    let month = '2017-07'
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getMonthAll.page', { month }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ ...data })
        }
      }).catch((error) => {

      })
    });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getMonthFactory.page', { month }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ yearFactory: data })
        }
      }).catch((error) => {

      })
    });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getMonthFactoryChart.page', { month }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ charList: data })
        }
      }).catch((error) => {

      })
    });
  }
  render() {
    let yearData = [];
    let yearFactory = this.state.yearFactory
    for (var i = 0; i < yearFactory.length; i++) {
      if (i < 3) {
        let item = yearFactory[i];
        yearData.push(item)
      }
    }
    const option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          interval: 'auto'
        },
        axisTick: {
          show: 'false',
          alignWithLabel: true
        },
        //x轴数据
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      yAxis: {},
      color: ['#ee5f8f', '#e8ba00', '#33cc99'],//自定义线条颜色，你可以设置多个颜色，使用时默认从第一个开始   如果不设置color则有它默认颜色
      // series里面的数据  如果是固定的线条 你只需要改变data数据就ok  
      // 如果不是确定有多少折线  建议吧整个serise数据替换掉   例如：series:[{...}{...}{...},...]配置项和下面一样
      series: [{
        name: 'NLU',
        type: 'line',
        data: [150, 220, 182, 191, 234, 290, 330, 310, 600, 700, 220, 182],
        areaStyle: {
          normal: {
            color: '#0ffdeff4'
          }
        }
      },
      {
        name: 'WEU',
        type: 'line',
        data: [220, 182, 191, 234, 290, 400, 310, 500, 400, 220, 182],
        areaStyle: {
          normal: {
            color: '#0ffdf8e5'
          }
        }
      },
      {
        name: 'WEU1',
        type: 'line',
        data: [220, 182, 191, 500, 400, 220, 182, 191, 200, 290, 500],
        areaStyle: {
          normal: {
            color: '#0feafaf5'
          }
        }
      }]
    };
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{
          paddingTop: 8,
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          flexDirection: 'row'
        }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {

          }}>
            <Iconfont
              icon={'e688'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <MonthPicker
            style={{ width: 120 }}
            customStyles={{
              dateText: {
                fontSize: 18,
                color: '#000',
              }
            }}
            selY={this.state.selY}
            selM={this.state.selM}
            onDateChange={(selY, selM, ymStr) => {

            }}
          />
          <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {

          }}>
            <Iconfont
              icon={'e657'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: '#f9f9f9',
          paddingTop: 12,
          paddingBottom: 12
        }}>
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
            <Text style={{ lineHeight: 24, marginLeft: 4, color: '#17c6c1', fontSize: 20 }}>{`${this.state.yearTotalSum}万`}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'未收'}</Text>
            <Text style={{ lineHeight: 24, marginLeft: 4, color: '#f80000', fontSize: 20 }}>{`${this.state.yearUnReceiveSum}万`}</Text>
          </View>
        </View>
        <View style={{
          paddingTop: 12,
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#dedede' }}>
            {
              yearData.map((item) => <View >
                <View style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  padding: 12
                }} key={`row_${item}`}>
                  <Text style={{ color: '#333', flex: 1 }}>{item.orgName}</Text>

                  <Text style={{ color: '#666' }}>{'总销售额'}</Text>
                  <Text style={{ marginLeft: 4, width: 68, color: '#17c6c1' }}>{`${item.factoryTotalSum}万`}</Text>
                  <Text style={{ color: '#666' }}>{'未收'}</Text>
                  <Text style={{ marginLeft: 4, width: 50, color: '#f80000' }}>{`${item.factoryUnReceiveSum}万`}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }}></View>
              </View>)
            }
          </View>
        </View>
        <View style={{
          marginLeft: 12,
          marginRight: 12,
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          flexDirection: 'row'
        }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {
          }}>
            <Text style={{ padding: 12, color: '#999' }}>{'点击查看更多'}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <Echarts option={option} height={300} />
      </View >
    );
  }
}
class S_DayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  render() {
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
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
        <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LeftRegional
            data={listData}
            sectionAction={(item) => {
              this.setState({ selectItem: item.salerList[0] })
            }}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
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
        </View>

      </View >
    );
  }
}

class TableRow extends React.Component {
  render() {
    let bg = this.props.bg;
    let tColor = this.props.tColor;
    let t0 = this.props.t0;
    let t1 = this.props.t1;
    let t2 = this.props.t2;
    return <View>
      <View style={{ flexDirection: 'row', backgroundColor: bg }}>
        <Text style={{ padding: 10, flex: 1, color: tColor }}>{t0}</Text>
        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        <Text style={{ padding: 10, flex: 1, color: tColor }}>{t1}</Text>
        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        <Text style={{ padding: 10, flex: 1, color: tColor }}>{t2}</Text>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
    </View>
  }
}

class LeftRegional extends React.Component {
  constructor(props) {
    super(props)
    this.renderSectionListItem = this.renderSectionListItem.bind(this);
    this.state = {
      preSelect: undefined
    }
    this.preSelect = undefined
  }
  sectionAction(item) {
    this.props.sectionAction && this.props.sectionAction(item)
    this.setState({ preSelect: item.factoryName })
  }
  renderSectionListItem(item) {
    let factoryName = item.factoryName
    let preSelect = this.state.preSelect
    if (!this.preSelect) {
      this.preSelect = factoryName
    }
    preSelect = preSelect ? preSelect : this.preSelect
    return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${factoryName}`}>
      <View>
        <View style={{ width: 100, padding: 12, backgroundColor: preSelect != factoryName ? '#fff' : '#f9f9f9' }}>
          <Text style={{ color: preSelect != factoryName ? '#333' : '#0081d4' }}>{item.factoryName}</Text>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, width: 100, backgroundColor: '#f9f9f9' }} />
      </View>
    </TouchableOpacity>
  }
  render() {
    return <ScrollView>
      {
        this.props.data.map((item) => this.renderSectionListItem(item))
      }
    </ScrollView>
  }
}
class S_HomeContainer extends React.Component {
  static navigationOptions = {
    title: '首页',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6aa' iconSize={24} iconColor={tintColor} />
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
              <ScrollableTabView renderTabBar={this.renderTabBar} >
                <S_HomePage key={'0'} {...this.props} tabLabel={'year'}/>
                <S_MonthPage key={'1'}  {...this.props} tabLabel={'month'}/>
                <S_DayPage key={'2'} {...this.props} tabLabel={'day'}/>
              </ScrollableTabView>
            </View>)
  }/*
  render() {
    let iosTop = Platform.OS === 'ios' ? 20 : 0;
    return (<View style={{ flex: 1 }}>
              <View style={{ height: iosTop, backgroundColor: '#0081d4' }} />
              <ScrollableTabView renderTabBar={this.renderTabBar} >
                <View key={'0'} {...this.props} tabLabel={'year'}/>
                <View key={'1'}  {...this.props} tabLabel={'month'}/>
                <View style={{backgroundColor:'#00ff00'}} key={'2'} {...this.props} tabLabel={'day'}/>
              </ScrollableTabView>
            </View>)
            */
  
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

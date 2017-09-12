import React from 'react';
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
import MonthPicker from '../../../components/MonthPicker'
import * as DateUtils from '../../../utils/DateUtils'
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import TableRow from './TableRow'

export default class S_MonthPage extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.onMoreAction = this.onMoreAction.bind(this);
    let { year, month } = DateUtils.yearMonth();

    this.state = {
      selY: year, selM: month,
      yearTotalSum: 0.00,
      yearUnReceiveSum: 0.00,
      yearFactory: [],
      charList: []
    }
  }
  componentDidMount() {
    this.loadData(this.state.selY, this.state.selM)
  }
  loadData(_year, _month) {
    let month = _year + '-' + (_month < 10 ? '0' + _month : _month)
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
  //点击更多查看
  onMoreAction() {
    const { navigation } = this.props;
   // navigation.navigate('S_HomeDetail')
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
    let charList = [];
    let old_charList = this.state.charList
    for (var i = 0; i < old_charList.length; i++) {
        if (i < 3) {
            let item = old_charList[i];
            charList.push(item)
        }
    }
    let seriesData = [];
    let xData = []
    let legend = [];
    charList.map((item) => {
      let chartItem = {};
      chartItem.type = 'line';
      chartItem.name = item.orgName;
      chartItem.data = [];
      let init = xData.length === 0
      item.dayList.map((monthListItem) => {
        let daytotalSum = monthListItem.daytotalSum;
        chartItem.data.push(parseFloat(daytotalSum));
        if (init) {
          xData.push(monthListItem.dayname);
        }
      })
      legend.push(item.orgName);
      seriesData.push(chartItem)
    })
    const option = {
      legend: {
        data:legend
    },
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
        data: xData
      },
      yAxis: {},
      color: ['#ee5f8f', '#e8ba00', '#33cc99'],//自定义线条颜色，你可以设置多个颜色，使用时默认从第一个开始   如果不设置color则有它默认颜色
      // series里面的数据  如果是固定的线条 你只需要改变data数据就ok  
      // 如果不是确定有多少折线  建议吧整个serise数据替换掉   例如：series:[{...}{...}{...},...]配置项和下面一样
      series: seriesData/*[{
        name: 'NLU',
        type: 'line',
        data: [150, 220, 182, 191, 234, 290, 330, 310, 600, 700, 220, 182],
      },
      {
        name: 'WEU',
        type: 'line',
        data: [220, 182, 191, 234, 290, 400, 310, 500, 400, 220, 182],
      },
      {
        name: 'WEU1',
        type: 'line',
        data: [220, 182, 191, 500, 400, 220, 182, 191, 200, 290, 500],
      }]*/
    };
    return (
      <ScrollView>
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
                this.loadData(selY, selM)
                this.setState({ selY, selM })
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
              <Text style={{ lineHeight: 24, marginLeft: 4, color: '#17c6c1', fontSize: 20 }}>{`${this.state.monthTotalSum}万`}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'未收'}</Text>
              <Text style={{ lineHeight: 24, marginLeft: 4, color: '#f80000', fontSize: 20 }}>{`${this.state.monthUnReceiveSum}万`}</Text>
            </View>
          </View>
          <View style={{
            paddingTop: 12,
            paddingLeft: 12,
            paddingRight: 12,
          }}>
            <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#dedede' }}>
              {
                yearData.map((item) => <View key={`row_${item.orgName}`}>
                  <View style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 12
                  }} >
                    <Text style={{ color: '#333', flex: 1 }}>{item.orgName}</Text>
                    <Text style={{ color: '#666' }}>{'总销售额'}</Text>
                    <Text style={{ marginLeft: 4, width: 68, color: '#17c6c1' }}>{`${item.factoryTotalSum}万`}</Text>
                    <Text style={{ color: '#666' }}>{'未收'}</Text>
                    <Text style={{ marginLeft: 4, width: 68, color: '#f80000' }}>{`${item.factoryUnReceiveSum}万`}</Text>
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
            <TouchableOpacity onPress={this.onMoreAction}>
              <Text style={{ padding: 12, color: '#999' }}>{'点击查看更多'}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
          <Echarts option={option} height={300} />
        </View >
      </ScrollView>
    );
  }
}
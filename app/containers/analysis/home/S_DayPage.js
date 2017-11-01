import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  Dimensions
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import TableRow from './TableRow'
import TableRowHeader from './TableRowHeader'
import LeftTabComponet from '../LeftTabComponet'
import * as DateUtils from '../../../utils/DateUtils'

const WINDOW_WIDTH = Dimensions.get('window').width;

export default class S_DayPage extends React.Component {
  constructor(props) {
    super(props);
    this.onItemPress = this.onItemPress.bind(this)
    this._selectByDate = this._selectByDate.bind(this);
    let { day } = DateUtils.getYearMonthDay();
    this.state = {
      data: [],
      day: day,
      selectItem: undefined,
      selectCust: true,
      loading: false,
    }
  }
  componentDidMount() {
    this._selectByDate(this.state.day);
  }
  _selectByDate(day) {
    this.setState({ day, loading: true })
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getDayFactory.page', { day }).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data.dayList;
          this.setState({ data, loading: false })
        } else {
          this.setState({ loading: false })
        }

      }).catch((error) => {
        this.setState({ loading: false })
      })
    });
  }
  onItemPress() {
    const { navigation } = this.props;
    navigation.navigate('S_DayDetail')
  }

  swithItemPress() {
    this.setState({ selectCust: !this.state.selectCust });
  }
  render() {
    let listData = this.state.data;
    let selectItem = this.state.selectItem;
    if (!selectItem) {
      selectItem = {}
      if (listData[0]) {
        selectItem = listData[0]
      }
    }
    let customerList = [];
    let employeeList = [];
    if (selectItem && selectItem.salerList) {
      customerList = selectItem.salerList[0].customerList ? selectItem.salerList[0].customerList : []
      employeeList = selectItem.salerList[0].employeeList ? selectItem.salerList[0].employeeList : []
    }
    let totalSela = selectItem.totalSum ? `${selectItem.totalSum}万元 未收 ${selectItem.unReceiverSum}万元` : '';//总销售额
    let dayMax = selectItem.dayFirstName ? `${selectItem.dayFirstName} ${selectItem.daySalerSum}元 未收 ${selectItem.dayUnReceiverSum ? selectItem.dayUnReceiverSum : 0}元` : '';//当日销售冠军
    let dayCustomer = selectItem.dayFirstCustomer ? `${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum}元 未收 ${selectItem.cusUnReceiverSum ? selectItem.cusUnReceiverSum : 0}元` : '';//当日最大客户
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
          <TouchableOpacity onPress={() => { }}>
            <Iconfont
              icon={'e688'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <DatePicker
            style={{ width: 100, }}
            date={this.state.day}
            customStyles={{
              dateInput: { borderWidth: 0 },
              dateText: { fontSize: 18, color: '#000', textAlign: 'left' }
            }}
            mode="date"
            showIcon={false}
            format="YYYY-MM-DD"
            confirmBtnText="确定"
            cancelBtnText="取消"
            onDateChange={(date) => {
              this._selectByDate(date)
            }}
          />
          <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => { }}>
            <Iconfont
              icon={'e657'} // 图标
              iconColor={'#aaa'}
              iconSize={26} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        {
          this.state.loading ? <LoadingView /> :
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
              <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
                <LeftTabComponet
                  data={listData}
                  sectionAction={(item) => {
                    this.setState({ selectItem: item })
                  }}
                />
              </View>
              <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', }}>
                <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
                  <View style={{ backgroundColor: '#fff', marginTop: 12, marginRight: 12, marginLeft: 12, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemUpAction}>
                      <View style={{ borderWidth: 1, borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, padding: 8, color: '#fff' }}>{`销售总额${selectItem.totalSum ? selectItem.totalSum : 0}万元`}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: 12, backgroundColor: '#f9f9f9', }} />
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemAction}>
                      <View style={{ borderWidth: 1, borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, padding: 8, color: '#fff' }}>{`未收 ${selectItem.unReceiverSum ? selectItem.unReceiverSum : 0}万元`}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
                    <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
                    <Text style={{ height: 32, color: '#17c6c1', marginTop: 4, marginBottom: 10 }}>{dayMax}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
                    <Text style={{ height: 32, color: '#17c6c1', marginTop: 4, marginBottom: 8 }}>{dayCustomer}</Text>
                  </View>
                  <Text style={{ color: '#999', marginLeft: 12, marginTop: 12, fontSize: 12 }}>{'销售额前20排名情况'}</Text>
                  <View style={{ backgroundColor: '#fff', margin: 10 }}>
                    <View style={{ height: 38, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 38 }}>
                        <TouchableOpacity style={{ flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' }} onPress={this.swithItemPress.bind(this, 0)}>
                          <Text style={{ color: !this.state.selectCust ? '#0081d4' : '#222' }}>{'客户'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: !this.state.selectCust ? '#0081d4' : '#c4c4c4', width: (WINDOW_WIDTH - 120) / 2 }} />
                      </View>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 38 }}>
                        <TouchableOpacity style={{ flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' }} onPress={this.swithItemPress.bind(this, 1)}>
                          <Text style={{ color: this.state.selectCust ? '#0081d4' : '#222' }}>{'业务员'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: this.state.selectCust ? '#0081d4' : '#c4c4c4', width: (WINDOW_WIDTH - 120) / 2 }} />
                      </View>
                    </View>
                    {
                      this.state.selectCust ?
                        employeeList.map((item, index) => <RowRightView key={`index_${index}`} item={item} />)
                        :                      
                        customerList.map((item, index) => <RowLeftView key={`index_${index}`} item={item} />)
                    }
                  </View>
                </View>
              </ScrollView>
            </View >
        }
      </View >
    );
  }
}

class RowLeftView extends React.Component {
  render() {
    let onPress = this.props.onPress
    let item = this.props.item;
    return <TouchableOpacity onPress={() => {
      onPress && onPress()
    }}>
      <View style={{ backgroundColor: '#fff', padding: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#333', flex: 1 }}>{item.customerName}</Text>
          <Text style={{ color: '#999', fontSize: 12, flex: 1, textAlign: 'right' }}>{item.cusPhone}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#f80000', fontSize: 12, marginTop: 5, flex: 1 }}>{`销售 ${item.customerSalerSum}元`}</Text>
          <Text style={{ color: '#f80000', fontSize: 12, marginTop: 5, flex: 1, textAlign: 'right' }}>{`未收${item.unpaidSum}元`}</Text>
        </View>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
    </TouchableOpacity>
  }
}

class RowRightView extends React.Component {
  render() {
    let onPress = this.props.onPress
    let item = this.props.item;
    return <TouchableOpacity onPress={() => {
      onPress && onPress()
    }}>
      <View style={{ backgroundColor: '#fff', padding: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#333', flex: 1 }}>{item.empName}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#f80000', fontSize: 12, marginTop: 5, flex: 1 }}>{`销售 ${item.empSalerSum}元`}</Text>
          <Text style={{ color: '#f80000', fontSize: 12, marginTop: 5, flex: 1, textAlign: 'right' }}>{`未收${item.unpaidSum}元`}</Text>
        </View>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
    </TouchableOpacity>
  }
}
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
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import TableRow from './TableRow'
import TableRowHeader from './TableRowHeader'
import LeftTabComponet from '../LeftTabComponet'

export default class S_DayPage extends React.Component {
  constructor(props) {
    super(props);
    this.onItemPress = this.onItemPress.bind(this)
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
  onItemPress() {
    const { navigation } = this.props;
    navigation.navigate('S_DayDetail')
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
    let totalSela = selectItem.totalSum ? `${selectItem.totalSum} 未收 ${selectItem.unReceiverSum}` : '';//总销售额
    let dayMax = selectItem.dayFirstName ? `${selectItem.dayFirstName} ${selectItem.daySalerSum} 未收 ${selectItem.dayUnReceiverSum ? selectItem.dayUnReceiverSum : 0}` : '';//当日销售冠军
    let dayCustomer =selectItem.dayFirstCustomer ? `${selectItem.dayFirstCustomer}(${selectItem.cusPhone}) ${selectItem.cusSalerSum} 未收 ${ selectItem.cusUnReceiverSum ? selectItem.cusUnReceiverSum : 0}` :'';//当日最大客户
    return (
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
            <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
              <Text style={{ color: '#666', fontSize: 12 }}>{'总销售额'}</Text>
              <Text style={{ color: '#000', marginTop: 4, marginBottom: 10 }}>{totalSela}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{'当日销售冠军'}</Text>
              <Text style={{ height:32, color: '#000', marginTop: 4, marginBottom: 10 }}>{dayMax}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{'当日最大客户'}</Text>
              <Text style={{ height:32,color: '#000', marginTop: 4, marginBottom: 10 }}>{dayCustomer}</Text>
            </View>
            <Text style={{ color: '#666', marginLeft: 12, marginTop: 12, fontSize: 14 }}>{'销售额排名情况'}</Text>
            <View style={{ backgroundColor: '#fff', margin: 10 }}>
              <TableRowHeader bg={'#17c6c1'} tColor={'#fff'} t0={'客户'} t1={'业务员'}/>
              {
                customerList.map((item,index) => {
                    let empName = '';
                    if(employeeList && employeeList.length > index){
                      empName = employeeList[index].empName;;
                    }
                     
                    return <TableRow key={`index_${index}`} /*onPress={this.onItemPress}*/ bg={'#fff'} tColor={'#666'} t0={item.customerName} t1={empName}/>
                })
              }
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
}
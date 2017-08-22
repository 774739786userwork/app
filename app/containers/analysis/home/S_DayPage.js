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
          <LeftTabComponet
            data={listData}
            sectionAction={(item) => {
              this.setState({ selectItem: item.salerList[0] })
            }}
          />
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', }}>
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
              <TableRowHeader bg={'#17c6c1'} tColor={'#fff'} t0={'工厂'} t1={'人数'} t2={'占比'} />
              {
                factoryList.map((item) => <TableRow key={`index_${item.orgName}`} onPress={this.onItemPress} bg={'#fff'} tColor={'#666'} t0={item.orgName} t1={item.personNumber} t2={item.proportion} />)
              }
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
}


import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    FlatList
} from 'react-native';

import { Iconfont, Toast } from 'react-native-go';
import DatePicker from 'react-native-datepicker'

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const WINDOW_WIDTH = Dimensions.get('window').width;
import * as DateUtils from '../../../utils/DateUtils'
let listViewData = []
let valeMap = {}
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}
class NewReturnGoodPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._selectByDate = this._selectByDate.bind(this)
        this._onItemPress = this._onItemPress.bind(this)
        this._onAddItemPress = this._onAddItemPress.bind(this)
        valeMap = {};
        let today = GetDateStr(0);
        valeMap.loadingbill_date = [today];
        listViewData = [
            {},
            { title: '客户', key: 'contactId', value: '请选择客户', target: 'SelectCustomers' },
            { title: '车牌号', key: 'car_id', value: '请选择车牌号', target: 'SelectCar' },
            { title: '退货日期', key: 'loadingbill_date', value: today },
            {},
            { title: '仓库', key: 'storehouse_id', value: '请选择仓库', target: 'SelectStore' },
        ];
        this.state = {
            listData: dataSource.cloneWithRows(listViewData),
        }
    }
    _selectByDate(item, dateValue) {
        item.value = dateValue;
        valeMap[item.key] = [dateValue];
        this.setState({ listData: dataSource.cloneWithRows(listViewData) });
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        navigation.navigate(item.target, {
            loadingdate: valeMap.loadingbill_date[0],
            callback: (data) => {
                item.data = data;
                if (data.platenumber) {
                    item.value = data.platenumber;
                    valeMap[item.key] = [data.platenumber, data.carbaseinfo_id,data.carweight];
                }
                if (data.customerName) {
                    item.value = data.customerName;
                    valeMap[item.key] = [data.customerName, data.contactId,data.contactName,data.mobile1,data.customerAddress];
                }
                if (data.STORE_HOUSE_NAME) {
                    item.value = data.STORE_HOUSE_NAME
                    valeMap[item.key] = [data.STORE_HOUSE_NAME, data.STORE_HOUSE_ID];
                }
                this.setState({ listData: dataSource.cloneWithRows(listViewData) });
            }
        });
    }
    _renderItem = (item, index) => {
        if (item.title) {
            return (
                <TouchableOpacity key={`row_${index}`} onPress={this._onItemPress.bind(this, item)}>
                    <View style={{ backgroundColor: '#fff' }} >
                        <View style={{ flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 54, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 18 }}>{item.title}</Text>
                            <View style={{ flex: 1 }} />
                            <View>
                                {
                                    item.target ?
                                        <Text style={{ color: '#999', fontSize: 14 }}>{item.value}</Text>
                                        :
                                        <DatePicker
                                            style={{ width: 100, }}
                                            date={item.value}
                                            minDate={GetDateStr(0)}
                                            maxDate={GetDateStr(1)}
                                            customStyles={{
                                                dateInput: { borderWidth: 0 },
                                                dateText: { color: '#999', textAlign: 'left' }
                                            }}
                                            mode="date"
                                            showIcon={false}
                                            format="YYYY-MM-DD"
                                            confirmBtnText="确定"
                                            cancelBtnText="取消"
                                            onDateChange={(date) => { this._selectByDate(item, date) }}
                                        />
                                }
                            </View>
                            <View>
                                <Iconfont
                                    icon={'e66e'} // 图标
                                    iconColor={'#999'}
                                    iconSize={22}
                                />
                            </View>
                        </View>
                        <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#e6e6e6' }} />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return <View style={{ backgroundColor: '#f2f2f2', height: 14 }} key={`row_${index}`}>
                <View style={{ flex: 1 }} />
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#e6e6e6' }} />
            </View>
        }

    }
    _onAddItemPress() {
        let i = 0;
        for (i; i < listViewData.length; i++) {
            let item = listViewData[i];
            if (item.value) {
                if (!valeMap.hasOwnProperty(item.key)) {
                    Toast.show(item.value); return;
                }
            }
        }
        const { navigation } = this.props;
        navigation.navigate('ReturnGoodList', valeMap)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.listData}
                    renderRow={this._renderItem}
                />
                <View style={{ height: 58, padding: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <TouchableOpacity onPress={this._onAddItemPress.bind(this)}>
                        <View style={{ flex: 1, width: WINDOW_WIDTH - 32, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#17c6c1', borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{'添加产品'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

class NewReturnGoodContainer extends React.Component {
  static navigationOptions = {
    title: '开退货单',
  };
  render() {
    return <NewReturnGoodPage {...this.props} />;
  }
}
export default NewReturnGoodContainer;

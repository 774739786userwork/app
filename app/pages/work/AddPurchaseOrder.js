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
import * as DateUtils from '../../utils/DateUtils'
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
/**
 * 开订货单
 */
class AddPurchaseOrder extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._selectByDate = this._selectByDate.bind(this)
        this._onItemPress = this._onItemPress.bind(this)
        this._onAddItemPress = this._onAddItemPress.bind(this)
        this.renderRightView = this.renderRightView.bind(this);
        valeMap = {};
        let today = GetDateStr(0);
        valeMap.order_date = [today];
        valeMap.saler_date = [today];
        listViewData = [
            { title: '客户', key: 'customer_id', value: '请选择客户', target: 'SelectCustomers' },
            { title: '订单日期', key: 'order_date', date: true, value: today },
            { title: '销售日期', key: 'saler_date', date: true, value: today },
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
            item:item,
            callback: (data) => {
                item.data = data;
                if (data.customersName) {
                    item.value = data.customersName;
                    valeMap[item.key] = [data.customersName, data.customersId];
                }
                
                this.setState({ listData: dataSource.cloneWithRows(listViewData) });
            }
        });
    }
    renderRightView(item) {
        if (item.target) {
            return (<View style={{ flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 54, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 18 }}>{item.title}</Text>
                <View style={{ flex: 1 }} />
                <View>
                    <Text style={{ color: '#999', fontSize: 14 }}>{item.value}</Text>
                </View>
                <View>
                    <Iconfont
                        icon={'e66e'} // 图标
                        iconColor={'#999'}
                        iconSize={22}
                    />
                </View>
            </View>);

        } else if (item.date) {
            return (<View style={{ flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 54, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 18 }}>{item.title}</Text>
                <View style={{ flex: 1 }} />
                <View>
                    <DatePicker
                        style={{ width: 100, }}
                        date={item.value}
                        /*minDate={GetDateStr(0)}
                        maxDate={GetDateStr(1)}*/
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
                </View>
                <View>
                    <Iconfont
                        icon={'e66e'} // 图标
                        iconColor={'#999'}
                        iconSize={22}
                    />
                </View>
            </View>);
        } 
    }
    _renderItem = (item, index) => {
        if (item.title) {
            return (
                <TouchableOpacity key={`row_${index}`} onPress={this._onItemPress.bind(this, item)}>
                    <View style={{ backgroundColor: '#fff' }} >
                        {
                            this.renderRightView(item)
                        }
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
        navigation.navigate('AddPurchaseOrderList', valeMap)
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
                            <Text style={{ color: '#fff', fontSize: 18 }}>{'选择商品'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

export default AddPurchaseOrder;

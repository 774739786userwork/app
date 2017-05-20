import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableHighlight,
    InteractionManager,
    FlatList
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'

class SelectDeliveryOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectByDate = this._selectByDate.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.state = {
            startDate: DateUtils.getYearMonthDay(),
            endDate: DateUtils.getYearMonthDay(),
            count: 0,
        }
    }
    componentDidMount() {
        const { action } = this.props;
        const { startDate, endDate } = this.state;
        InteractionManager.runAfterInteractions(() => {
            action.selectDeliveryOrder(startDate, endDate);
        });
    }
    _selectByDate(_startDate, _endDate) {
        const { action } = this.props;
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectDeliveryOrder(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectDeliveryOrder(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }
    _rowOnPress(rowData) {
        const { navigate } = this.props.navigation;
        navigate('DeliveryOrderDetail',rowData);
    }
    _renderItem = (item, index) => {
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 34, backgroundColor: '#f9f9f9' }}>
                        <View style={{ marginRight: 4 }}>
                            <Iconfont fontFamily={'OAIndexIcon'}
                                icon='e6bf'
                                iconColor='#118cd7'
                                iconSize={16}
                            />
                        </View>
                        <Text style={{ color: '#118cd7' }}>{item.delivery_date}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#666' }}>{'送货单数'}</Text>
                        <View style={{
                            backgroundColor: '#fe6732',
                            borderRadius: 10,
                            height: 20,
                            width: 20,
                            alignItems: 'center',
                            marginLeft: 8,
                            marginRight: 8,
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontSize: 12, color: '#fff' }}>{'10'}</Text>
                        </View>
                    </View>
                    <View style={{ height: 34, paddingLeft: 12, paddingRight: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 2, color: '#333', textAlign: 'left', fontSize: 16 }}>{item.shop_name}</Text>
                        <Text style={{ flex: 1, color: '#999', textAlign: 'right' }}>{item.contacts_mobile}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f80000' }}>{'未收金额：'}</Text>
                        <Text style={{ color: '#f80000' }}>{item.unpaid_total_sum + '元'}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'抹零金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.count_small_change_sum + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'总计金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.total_sum + '元'}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    //加载更多
    onEndReached() {
        const { action, selectDeliveryOrder } = this.props;
        const { startDate, endDate } = this.state;
        const start = selectDeliveryOrder.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.selectDeliveryOrder(startDate, endDate, start);
            }
        });
    }
    render() {
        const { selectDeliveryOrder } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <DatePicker
                            style={{ width: 100, }}
                            date={this.state.startDate}
                            customStyles={{
                                dateInput: { borderWidth: 0 },
                                dateText: { color: '#fff' }
                            }}
                            mode="date"
                            showIcon={false}
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={(date) => { this._selectByDate(date) }}
                        />
                        <Text style={{ color: '#00548b' }}>
                            {'开始'}
                        </Text>
                        <Text style={{ color: '#fff', marginLeft: 8, marginRight: 8 }}>
                            {'----'}
                        </Text>
                        <DatePicker
                            style={{ width: 100, }}
                            date={this.state.endDate}
                            customStyles={{
                                dateInput: { borderWidth: 0 },
                                dateText: { color: '#fff' }
                            }}
                            mode="date"
                            showIcon={false}
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={(date) => { this._selectByDate(null, date) }}
                        />
                        <Text style={{ color: '#00548b' }}>
                            {'结束'}
                        </Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'总销售额：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.d_total_sum + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'未收金额：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.d_unpaid_total_sum + '元'}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'抹零总计：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.d_count_small_change_sum + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'送货单数：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.delivery_note_number + '张'}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ flex: 1 }}>
                    <LoadingListView
                        loading={selectDeliveryOrder.loading}
                        loadMore={selectDeliveryOrder.loadMore}
                        listData={selectDeliveryOrder.listData}
                        renderRowView={this._renderItem}
                        onEndReached={this.onEndReached} />
                </View>
            </View >
        );
    }
}

export default SelectDeliveryOrderPage;

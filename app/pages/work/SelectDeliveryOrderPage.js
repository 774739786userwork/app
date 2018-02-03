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
import { Iconfont, LoadingView, Toast } from 'react-native-go';
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
    componentWillReceiveProps(nextProps) {
        const { selectDeliveryOrder } = nextProps;
        if (selectDeliveryOrder.errMsg) {
            Toast.show(selectDeliveryOrder.errMsg);
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
        navigate('DeliveryOrderDetail', rowData);
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
                        <Text style={{ color: '#666', fontSize: 12 }}>送货单编号：</Text>
                        <Text style={{ color: '#f80000', fontSize: 16, marginRight: 8 }}>{item.deliveryNotesNumber}</Text>
                    </View>
                    <View style={{ height: 34, paddingLeft: 12, paddingRight: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 2, color: '#333', textAlign: 'left', fontSize: 16 }}>{item.customer_name}</Text>
                        <Text style={{ flex: 1, color: '#999', textAlign: 'right' }}>{item.contact_mobile}</Text>
                    </View>
                    {
                        item.goodsList.map((goodsItem) => (
                            <View style={{ height: 30, paddingLeft: 12,paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{flex: 1,textAlign: 'left', color: '#999' }}>{goodsItem.name + ': '}</Text>
                                <Text style={{flex: 1,textAlign: 'left',color: '#999' }}>{goodsItem.quantity + goodsItem.unit}</Text>
                                {
                                global.userStyle ? null :
                                <Text style={{flex: 1, textAlign: 'right',color: '#f80000'}}>{'记: '+goodsItem.delivery_remember_name}</Text>}
                            </View>))
                    }
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f80000' }}>{'铺货金额：'}</Text>
                        <Text style={{ color: '#f80000' }}>{item.distribution_sum ? item.distribution_sum : 0 + '元'}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'优惠金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.discount_sum ? item.discount_sum : 0 + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'抹零金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.count_small_change_sum ? item.count_small_change_sum : 0 + '元'}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'未收金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.unpaid_total_sum ? item.unpaid_total_sum : 0 + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'总计金额：'}</Text>
                            <Text style={{ color: '#f80000',marginLeft:8 }}>{item.total_sum ? item.total_sum : 0 + '元'}</Text>
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
                        <Text style={{ color: '#fff', width: 100, textAlign: 'center' }}>
                            {selectDeliveryOrder.begin_date}
                        </Text>
                        <Text style={{ color: '#00548b' }}>
                            {'开始'}
                        </Text>
                        <Text style={{ color: '#fff', marginLeft: 8, marginRight: 8 }}>
                            {'----'}
                        </Text>
                        <Text style={{ color: '#fff', width: 100, textAlign: 'center' }}>
                            {selectDeliveryOrder.end_date}
                        </Text>
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
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'铺货总计：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.d_distribution_sum + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#00548b' }}>{'优惠总计：'}</Text>
                            <Text style={{ color: '#fff' }}>{selectDeliveryOrder.d_discount_sum + '元'}</Text>
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

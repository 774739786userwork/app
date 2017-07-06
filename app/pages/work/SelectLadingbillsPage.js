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
const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});
class SelectLadingbillsPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectLadingbillsByDate = this._selectLadingbillsByDate.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this.onItemPress = this.onItemPress.bind(this)
        this.state = {
            startDate: DateUtils.getYearMonthDay(),
            endDate: DateUtils.getYearMonthDay(),
            count: 0,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { selectLadingbills } = nextProps;
        if (selectLadingbills.errMsg) {
            Toast.show(selectLadingbills.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        const { startDate, endDate } = this.state;
        InteractionManager.runAfterInteractions(() => {
            action.selectLadingbills(startDate, endDate);
        });
    }
    _selectLadingbillsByDate(_startDate, _endDate) {
        const { action } = this.props;
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectLadingbills(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectLadingbills(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }
    onItemPress(rowData) {
        const { navigate } = this.props.navigation;
       // navigate('SelectLadingbillsDetail', rowData);
    }
    _renderItem = (item, index) => {
        return (
            <TouchableHighlight
                onPress={this.onItemPress.bind(this, item)}
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
                        <Text style={{ color: '#118cd7' }}>{item.loadingdate}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#666', fontSize: 12 }}>提货单编号：</Text>
                        <Text style={{ color: '#666', fontSize: 12, marginRight: 8 }}>{item.serial_number}</Text>
                    </View>
                    <View style={{ height: 8 }} />
                    {
                        item.goodsList.map((goodsItem) => (
                            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333' }}>{goodsItem.name}</Text>
                                <Text style={{ color: '#333' }}>{': '}</Text>
                                <Text style={{ color: '#333' }}>{goodsItem.quantity}</Text>
                                <View style={{ width: 8 }} />
                                <Text style={{ color: '#333' }}>{goodsItem.unit}</Text>
                            </View>))
                    }
                    <View style={{ flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>{item.goodsStr}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'车次：'}</Text>
                            <Text style={{ color: '#f80000' }}>{'第' + item.loadingcount + '车'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'开单人：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.create_user_name}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'车牌:'}</Text>
                            <Text style={{ color: '#f80000',marginLeft:8 }}>{item.car_number}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    //加载更多
    onEndReached() {
        const { action, selectLadingbills } = this.props;
        const { startDate, endDate } = this.state;
        const start = selectLadingbills.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.selectLadingbills(startDate, endDate, start);
            }
        });
    }
    render() {
        const { selectLadingbills } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 74, backgroundColor: '#f2f2f2' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingBottom: 8 }}>
                        {
                            false ? <DatePicker
                                style={{ width: 100, }}
                                disabled={true}
                                date={selectLadingbills.begin_date}
                                customStyles={{
                                    dateInput: { borderWidth: 0 },
                                    dateText: { color: '#fff' }
                                }}
                                mode="date"
                                showIcon={false}
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                onDateChange={(date) => { this._selectLadingbillsByDate(date) }}
                            /> : null
                        }
                        <Text style={{ color: '#999', width: 100, textAlign: 'center' }}>
                            {selectLadingbills.begin_date}
                        </Text>
                        <Text style={{ color: '#999' }}>
                            {'开始'}
                        </Text>
                        <Text style={{ color: '#999', marginLeft: 8, marginRight: 8 }}>
                            {'----'}
                        </Text>
                        {
                            false ? <DatePicker
                                style={{ width: 100, }}
                                date={selectLadingbills.end_date}
                                customStyles={{
                                    dateInput: { borderWidth: 0 },
                                    dateText: { color: '#fff' }
                                }}
                                disabled={true}
                                mode="date"
                                showIcon={false}
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                onDateChange={(date) => { this._selectLadingbillsByDate(null, date) }}
                            /> : null
                        }
                        <Text style={{ color: '#999', width: 100, textAlign: 'center' }}>
                            {selectLadingbills.end_date}
                        </Text>
                        <Text style={{ color: '#999' }}>
                            {'结束'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text style={{ color: '#999' }}>
                            {'提货次数'}
                        </Text>
                        <Text style={{ color: '#f80000', marginLeft: 8 }}>
                            {'' + selectLadingbills.count}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <LoadingListView
                        loading={selectLadingbills.loading}
                        loadMore={selectLadingbills.loadMore}
                        listData={selectLadingbills.listData}
                        renderRowView={this._renderItem}
                        onEndReached={this.onEndReached} />
                </View>
            </View >
        );
    }
}

export default SelectLadingbillsPage;

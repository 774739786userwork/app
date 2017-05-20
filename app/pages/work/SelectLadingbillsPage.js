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
        this.onEndReached =this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
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
    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 34, backgroundColor: '#f9f9f9' }}>
                    <View style={{ marginRight: 4 }}>
                        <Iconfont fontFamily={'OAIndexIcon'}
                            icon='e6bf'
                            iconColor='#118cd7'
                            iconSize={16}
                        />
                    </View>
                    <Text style={{ color: '#118cd7' }}>{item.loadingdate}</Text>
                </View>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>提货单编号：</Text>
                    <Text style={{ color: '#333', fontSize: 16 }}>{item.serial_number}</Text>
                </View>
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
                </View>
            </View>);
    }
    _separator = () => {
        return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />;
    }
    //加载更多
    onEndReached() {
        const { action,selectLadingbills } = this.props;
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
                <View style={{ height: 74, backgroundColor: '#118cd7' }}>
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
                            onDateChange={(date) => { this._selectLadingbillsByDate(date) }}
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
                            onDateChange={(date) => { this._selectLadingbillsByDate(null, date) }}
                        />
                        <Text style={{ color: '#00548b' }}>
                            {'结束'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text style={{ color: '#00548b' }}>
                            {'提货次数'}
                        </Text>
                        <Text style={{ color: '#fff', marginLeft: 8 }}>
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

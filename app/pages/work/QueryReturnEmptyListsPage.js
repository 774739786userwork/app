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
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
/**
 * 退货单查询
 */
class QueryReturnEmptyListsPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectByDate = this._selectByDate.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.state = {
            loading: false,
            loadMore: false,
            listData: [],
            returnTotalSum: 0.0,
            smallChangeTotalSum: 0.0,
            startDate: DateUtils.getYearMonthDay(),
            endDate: DateUtils.getYearMonthDay(),
            count: 0,
        }
    }

    componentDidMount() {
        const { startDate, endDate } = this.state;
        InteractionManager.runAfterInteractions(() => {
            this.queryReturnLists(startDate, endDate);
        });
    }
    queryReturnLists(startDate, endDate, page = 1) {
        const token = LoginInfo.getUserInfo().token;
        const userId = LoginInfo.getUserInfo().user_id;
        let returnType = '1';
        let reqParams = { token, userId, returnType };
        reqParams.page = page;
        reqParams.rows = 10;
        let loadMore = page > 1
        if (loadMore) {
            this.setState({ loadMore: true });
        } else {
            this.setState({ loading: true });
        }

        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/returnmanage/queryListInfoReturnLists.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let returnList = data.returnList;
                    let smallChangeTotalSum = data.smallChangeTotalSum;
                    let returnTotalSum = data.returnTotalSum;
                    if (loadMore) {
                        if (data) {
                            let list = this.state.listData.concat(returnList);
                            this.setState({ listData: list, loadMore: false });
                        } else {
                            this.setState({ loadMore: false });
                        }

                    } else {
                        this.setState({ smallChangeTotalSum, returnTotalSum, listData: returnList ? returnList : [], loading: false });
                    }
                } else {
                    if (loadMore) {
                        this.setState({ loadMore: false });
                    } else {
                        this.setState({ loading: false });
                    }
                    Toast.show(responseData.msg);
                }
            }).catch((error) => {
                console.log(error)
                if (loadMore) {
                    this.setState({ loadMore: false });
                } else {
                    this.setState({ loading: false });
                }
                Toast.show("网络错误");
            })
        });

    }


    _selectByDate(_startDate, _endDate) {
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                this.queryReturnLists(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                this.queryReturnLists(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }
    _rowOnPress(rowData) {
        const { navigate } = this.props.navigation;
        rowData.returnType = '1';
        navigate('QueryReturnDetail', rowData);
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
                        <Text style={{ color: '#118cd7' }}>{item.returnDate}</Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>{'退货编号：'}</Text>
                        <Text style={{ color: '#666' }}>{item.serialNumber}</Text>
                    </View>
                    <View style={{ height: 34, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 2, color: '#333', textAlign: 'left', fontSize: 16 }}>{item.customerName}</Text>
                        <Text style={{ flex: 1, color: '#999', textAlign: 'right' }}>{item.customerMobile}</Text>
                    </View>
                    {
                        item.goodsList.map((goodsItem) => (
                            <View style={{ height: 30, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, textAlign: 'left', color: '#999' }}>{goodsItem.name + ': '}</Text>
                                <Text style={{ flex: 1, textAlign: 'left', color: '#999' }}>{goodsItem.quantity + goodsItem.unit}</Text>
                            </View>))
                    }
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'退款金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.totalSum + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'退货人：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.returnPerson}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f80000' }}>{'退款原因：'}</Text>
                        <Text style={{ color: '#f80000' }}>{item.returnReason}</Text>
                    </View>

                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    //加载更多
    onEndReached() {
        const { startDate, endDate, listData } = this.state;
        const start = listData.length;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                this.queryReturnLists(startDate, endDate, start / 10 + 1);
            }
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#f2f2f2' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <DatePicker
                            style={{ width: 100, }}
                            date={this.state.startDate}
                            customStyles={{
                                dateInput: { borderWidth: 0 },
                                dateText: { color: '#999' }
                            }}
                            mode="date"
                            showIcon={false}
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={(date) => { this._selectByDate(date) }}
                        />
                        <Text style={{ color: '#999' }}>
                            {'开始'}
                        </Text>
                        <Text style={{ color: '#999', marginLeft: 8, marginRight: 8 }}>
                            {'----'}
                        </Text>
                        <DatePicker
                            style={{ width: 100, }}
                            date={this.state.endDate}
                            customStyles={{
                                dateInput: { borderWidth: 0 },
                                dateText: { color: '#999' }
                            }}
                            mode="date"
                            showIcon={false}
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={(date) => { this._selectByDate(null, date) }}
                        />
                        <Text style={{ color: '#999' }}>
                            {'结束'}
                        </Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text style={{ color: '#999' }}>{'退货总计：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${this.state.returnTotalSum}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text style={{ color: '#999' }}>{'抹零总计：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${this.state.smallChangeTotalSum}`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <LoadingListView
                        loading={this.state.loading}
                        loadMore={this.state.loadMore}
                        listData={dataSource.cloneWithRows(this.state.listData)}
                        renderRowView={this._renderItem}
                        onEndReached={this.onEndReached} />
                </View>
            </View >
        );
    }
}

export default QueryReturnEmptyListsPage;

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
import { Iconfont, LoadingView, Toast, FetchManger,LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class QueryReturnListsPage extends React.Component {
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
        let returnType = 0;
        let reqParams = { token, userId, returnType };
        reqParams.page = page;
        reqParams.rows = 10;
        let loadMore = page > 1
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/returnmanage/queryListInfoReturnLists.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    if (loadMore) {
                        if (data) {
                            let list = this.state.listData.concat(data);
                            this.setState({ listData: list, loadMore: false });
                        } else {
                            this.setState({ loadMore: false });
                        }

                    } else {
                        this.setState({ listData: data ? data : [], loading: false });
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
                        <Text style={{ color: '#118cd7' }}>{item.return_date}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#fe6732', marginRight: 12 }}>{item.status}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>{'送货编号：'}</Text>
                        <Text style={{ color: '#666' }}>{item.serial_number}</Text>
                    </View>
                    <View style={{ height: 34, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 2, color: '#333', textAlign: 'left', fontSize: 16 }}>{item.customername}</Text>
                        <Text style={{ flex: 1, color: '#999', textAlign: 'right' }}>{item.customerphone}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'退款金额：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.foregift + '元'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000' }}>{'退货人：'}</Text>
                            <Text style={{ color: '#f80000' }}>{item.create_person}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f80000' }}>{'退款原因：'}</Text>
                        <Text style={{ color: '#f80000' }}>{item.return_reason}</Text>
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
                this.queryReturnLists(startDate, endDate,  start / 10 + 1);
            }
        });
    }
    render() {
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
                        <Text style={{ color: '#00548b' }}>{'总金额：'}</Text>
                        <Text style={{ color: '#fff' }}>{'0元'}</Text>
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

export default QueryReturnListsPage;

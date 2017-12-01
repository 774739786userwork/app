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

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});
class UnAuditedLadingbillsPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectLadingbillsByDate = this._selectLadingbillsByDate.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.onItemPress = this.onItemPress.bind(this);
        this.state = {
            loading: false,
            loadMore: false,
            listData: [],
            startDate: '',//DateUtils.getYearMonthDay(),
            endDate: '',//DateUtils.getYearMonthDay(),
            loadingcount: 0,
        }
    }
    
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            this.unAuditedLadingbillsLists();
        });
    }

    unAuditedLadingbillsLists(page = 1) {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        let print_status = '0';
        let reqParams = { token, user_id, print_status };
        reqParams.page = page;
        reqParams.rows = 10;
        let loadMore = page > 1
        if (loadMore){
            this.setState({loadMore:true});
        }else{
            this.setState({loading:true});
        }
        
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/ladingbills/selectLadingbills.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let returnList = data.ladbiling_order_list;
                    let loadingcount = data.total_record ? data.total_record :0;
                    let begin_date = data.begin_date;
                    let end_date = data.end_date;
                    if (loadMore) {
                        if (data) {
                            let list = this.state.listData.concat(returnList);
                            this.setState({ listData: list, loadMore: false });
                        } else {
                            this.setState({ loadMore: false });
                        }

                    } else {
                        this.setState({loadingcount,begin_date,end_date,listData: returnList ? returnList : [], loading: false });
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
            })
        });

    }

    _selectLadingbillsByDate(_startDate, _endDate) {
        const { action } = this.props;
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                this.unAuditedLadingbillsLists(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                this.unAuditedLadingbillsLists(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }
    /**
     * 
 
     car_id: ["云AIC9W8", 149, "3000"]
loadingbill_date:["2017-9-27"]
storehouse_id: ["昆明多邦仓库", 100001]
upEmployeeIds: ["100012,", "蔡桥,"]

     */
 onItemPress(rowData) {
        const { navigate } = this.props.navigation;

        let car_id = [rowData.car_number,rowData.car_id,rowData.carweight];//[data.platenumber, data.carbaseinfo_id,data.carweight];
        let loadingbill_date = [rowData.loadingdate];//[today];
        let upEmployeeIds = [rowData.porters_id,rowData.porters_name];//[data.name, data.id];
        let storehouse_id = [rowData.store_house_name,rowData.store_house_id];
        let goodsList = rowData.goodsList;
        let loading_id = rowData.id;

        let valeMap = {car_id,loadingbill_date,upEmployeeIds,storehouse_id,goodsList,loading_id};
        navigate('AddLadingbillsProduct', valeMap);
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
                                <Text style={{ color: '#f80000' }}>{goodsItem.product_total_count}</Text>
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
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000',marginLeft:20}}>{item.car_number}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
                </TouchableHighlight>);
    }
    //加载更多
    onEndReached() {
        const {listData } = this.state;
        const start = listData.length;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                this.queryReturnLists(start / 10 + 1);
            }
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 74, backgroundColor: '#f2f2f2' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingBottom: 8 }}>
                        {
                            false ? <DatePicker
                                style={{ width: 100, }}
                                disabled={true}
                                date={this.state.begin_date}
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
                            {this.state.begin_date}
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
                                date={this.state.end_date}
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
                            {this.state.end_date}
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
                            {'' + this.state.loadingcount}
                        </Text>
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

export default UnAuditedLadingbillsPage;
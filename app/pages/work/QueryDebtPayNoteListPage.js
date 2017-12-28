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
const ic_peisong = require('../../imgs/ic_paisong.png');
const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});
var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class QueryDebtPayNoteListPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectByDate = this._selectByDate.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.state = {
            loading:false,
            startDate: DateUtils.getYearMonthDayKD(),
            endDate: DateUtils.getYearMonthDayKD(),
            dataList:[]
        }
    }

    componentDidMount() {
        const { startDate, endDate } = this.state;
        InteractionManager.runAfterInteractions(() => {
            this._onLoadData(startDate, endDate);
        });
    }

    _onLoadData(startDate,endDate){
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;
        let reqParams = { token, user_id, organization_id };
        reqParams.startDate = startDate;
        reqParams.endDate = endDate;
        
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/advancesReceived/queryPayMentList.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({dataList:data,loading: false})

                } else {
                    this.setState({ loading: false });
                    Toast.show(responseData.msg);
                }
            }).catch((error) => {
                console.log(error)
                Toast.show("网络错误");
                this.setState({ loading: false });
            })
        });
    }

    _selectByDate(_startDate, _endDate) {
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                this._onLoadData(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                this._onLoadData(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }

    _renderItem = (item, index) => {
        return (
        <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
            <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 30, backgroundColor: '#f9f9f9' }}>
                <View style={{ marginRight: 4 }}>
                    <Iconfont fontFamily={'OAIndexIcon'}
                        icon='e6bf'
                        iconColor='#118cd7'
                        iconSize={16}
                    />
                </View>
                <Text style={{ color: '#118cd7' }}>{`送货日期：${item.delivery_date}`}</Text>
            </View>
            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>{item.customer_name}</Text>
            </View>
            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'欠款总额：'}</Text>
                    <Text style={{ color: '#f80000' }}>{`${item.debt_totalSum}元`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'欠款余额：'}</Text>
                    <Text style={{ color: '#f80000' }}>{`${item.debt_sum}元`}</Text>
                </View>
            </View>

            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'对冲余额：'}</Text>
                    <Text style={{ color: '#f80000' }}>{`${item.payment_sum}元`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'操作人：'}</Text>
                    <Text style={{ color: '#666' }}>{item.operate_person}</Text>
                </View>
            </View>
            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>{'对冲日期：'}</Text>
                <Text style={{ color: '#666' }}>{item.payback_date}</Text>
            </View>
            <Image source={ic_peisong} style={{ justifyContent: 'center', paddingBottom: 8, alignItems: 'center', position: 'absolute', width: 24, height: 54, top: 0, right: 14, }}>
                <Text style={{ fontSize: 12, color: '#fff', backgroundColor: '#fe6732' }}>{this.charatState(item.debt_status)}</Text>
            </Image>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>);
    }

    charatState(state) {
        let target = new String();
        let lenght = state.length;
        for (i = 0; i < lenght; i++) {
            target = target.concat(state.charAt(i))
            if (i != lenght - 1)
                target = target.concat('\n');
        }
        return target;
    }

    render() {
        return(
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 50, backgroundColor: '#f2f2f2' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingBottom: 5 }}>
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
                </View>
                <View style={{ flex: 1 }}>
                <LoadingListView
                    loading={this.state.loading}
                    listData={dataSource.cloneWithRows(this.state.dataList)}
                    renderRowView={this._renderItem}
                    onEndReached={this.onEndReached} />
                </View>
            </View >
        );
    }
}
export default QueryDebtPayNoteListPage;
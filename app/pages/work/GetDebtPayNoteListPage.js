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
    DatePickerAndroid,
    TouchableHighlight
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, FetchManger, Spinner, LoginInfo } from 'react-native-go'
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import { NavigationActions } from 'react-navigation'
import DebtPayEditModel from './DebtPayEditeModel';
const WINDOW_WIDTH = Dimensions.get('window').width;

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class GetDebtPayNoteListPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
        this._selectByDate = this._selectByDate.bind(this);

        let today = GetDateStr(0);
        this.state = {
            showSpinner: false,
            modalVisible: false,
            loadingdate: today,
            selectItem: {},
            data: []
        }
    }

    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            // action.getPayMentList();
            this.get_payment_list();
        });
    }

    componentWillReceiveProps(nextProps) {
        const { getPayMentList } = nextProps;

        if (getPayMentList.errMsg) {
            Toast.show(getPayMentList.errMsg);
        }
        this.setState({ data: getPayMentList.result })
    }

    _rowOnPress(selectItem) {
        this.setState({ modalVisible: true, selectItem });
    }
    //payment_sum 还款金额
    //debt_sum 欠款金额

    get_payment_list(){
        let item = {
            "customer_id": "805141257",
            "delivery_date": "2017-09-21",
            "promise_date": "2017-09-21",
            "customer_name": "湘中陶瓷城圣卡陶瓷",
            "debt_sum": 2145
        }
        let data = [];
        for (let i = 0; i < 1; i++) {
            data.push(item);
        }

        this.setState({data});
    }

    _renderItem = (item, index) => {
        let payment_sum = item.payment_sum ? item.payment_sum : 0
        let debt_sum = item.debt_sum - payment_sum
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                    <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.customer_name}`}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'欠款：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${debt_sum}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'还款：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${payment_sum}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }

    onConfirmPress(id, newCount) {
        const { action } = this.props;
        let selectItem = this.state.selectItem;
        selectItem.disburden_quantity = newCount;
        this.setState({ modalVisible: false, selectItem });
    }
    onCancelPress() {
        this.setState({ modalVisible: false });
    }

    //选日期
    _selectByDate(dateValue) {
        this.state.loadingdate = dateValue;
        const { action } = this.props;
        // action.getPayMentList(dateValue);
        this.get_payment_list();
    }

    render() {
        const { getPayMentList } = this.props;
        let list = this.state.data ? this.state.data : 0;//getPayMentList.result ? this.state.data : [];
        // list = list ? list : []
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 10, backgroundColor: '#f2f2f2' }} ></View>
                <DebtPayEditModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 18 }}>{'提货日期'}</Text>
                    <View style={{ flex: 1 }} />
                    <DatePicker
                        style={{ width: 100, }}
                        date={this.state.loadingdate}
                        customStyles={{
                            dateInput: { borderWidth: 0 },
                            dateText: { color: '#999', textAlign: 'left' }
                        }}
                        mode="date"
                        showIcon={false}
                        format="YYYY-MM-DD"
                        confirmBtnText="确定"
                        cancelBtnText="取消"
                        onDateChange={(date) => {
                            this._selectByDate(date)
                        }}
                    />
                    <View>
                        <Iconfont
                            icon={'e66e'} // 图标
                            iconColor={'#999'}
                            iconSize={22}
                        />
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 18 }}>{'欠款总计'}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', fontSize: 16,marginRight:60 }}>{'8000元'}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
                <View style={{ height: 30, paddingLeft: 10, backgroundColor: '#f2f2f2', justifyContent: 'center' }} >
                    <Text style={{ color: '#999' }}>{'欠款明细如下：'}</Text>
                </View>
                <LoadingListView
                    loading={getPayMentList.loading}
                    loadMore={getPayMentList.loadMore}
                    listData={dataSource.cloneWithRows(list)}
                    renderRowView={this._renderItem} />
                {
                    list.length > 0 ?
                        <View>
                            <TouchableOpacity 
                                underlayColor={'#999'}
                                style={{ height: 44, width: WINDOW_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, color: '#0081d4', }}>欠款对冲</Text>
                            </TouchableOpacity >
                        </View>
                        : null
                }
                <View><Spinner visible={this.state.showSpinner} textContent={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default GetDebtPayNoteListPage;
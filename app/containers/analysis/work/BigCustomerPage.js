//
import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager,
    ScrollView
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go';
import LoadingListView from '../../../components/LoadingListView';
import ImageView from '../../../components/ImageView';
import * as DateUtils from '../../../utils/DateUtils'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//产品大客户
class BigCustomerPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `产品大客户`,
    });

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this._renderBranchRow = this._renderBranchRow.bind(this);
        this._rowOnBranchPress = this._rowOnBranchPress.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this._selectByDate = this._selectByDate.bind(this);
        this.state = {
            startDate: DateUtils.getYearMonthDay(),
            endDate: DateUtils.getYearMonthDay(),
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        const userId = LoginInfo.getUserInfo().user_id;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getMyFocusFactory.page?userId='+userId, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    const { startDate, endDate } = this.state;
                    let orgId = undefined;
                    if (data.length > 0) {
                        data[1].selected = true;
                        orgId = data[1].orgId;
                        this.loadDetail(startDate, endDate, orgId, userId);
                    }
                    this.setState({ branchFactoryList: data, orgId, loading: false })

                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });


    }
    loadDetail(startDate, endDate, orgId, userId) {
        let p = { startDate, endDate, orgId, userId };
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getProductBigCustomer.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ listData: data, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    onItemAction(item) {

    }

    _renderRow(item, rowID) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${rowID}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPhone}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPrecent}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                </View>
            </TouchableOpacity>);
    }
    _rowOnBranchPress(item) {
        let branchFactoryList = this.state.branchFactoryList;
        branchFactoryList.map((_item) => {
            _item.selected = false;
            if (_item.orgId === item.orgId) {
                _item.selected = true;
            }
        })
        const { startDate, endDate } = this.state;
        let orgId = item.orgId;
        this.loadDetail(startDate, endDate, orgId);

        this.setState({ branchFactoryList, orgId})
    }
    _renderBranchRow(item, sectionID, index) {
        let selected = item.selected;
        return <TouchableOpacity
            onPress={this._rowOnBranchPress.bind(this, item)}
            key={`row_${index}`}
        >
            <View style={{ width: 120, height: 40, backgroundColor: '#fff' }}>
                <Text style={{ color: selected ? '#0081d4' : '#000', textAlign: 'center', lineHeight: 38, width: 120 }}>{item.orgName}</Text>
                <View style={{ height: 2, width: 120, backgroundColor: selected ? '#0081d4' : '#fff' }} />
            </View>
        </TouchableOpacity>
    }

    _selectByDate(_startDate, _endDate) {
        let orgId = this.state.orgId;
        this.loadDetail(_startDate, _endDate,orgId);
        if (_startDate) {
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            this.setState({ endDate: _endDate });
        }
    }
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View>
                <ListView
                    enableEmptySections={true}
                    dataSource={hl_ds.cloneWithRows(this.state.branchFactoryList)}
                    renderRow={this._renderBranchRow}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 4 }}>
                <View style={{ flex: 1 }} />
                <Iconfont
                    icon={'e688'} // 图标
                    iconColor={'#aaa'}
                    iconSize={24} />
                <DatePicker
                    style={{ width: 80 }}
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
                <Text style={{ color: '#999', marginLeft: 8, marginRight: 8 }}>
                    {'--'}
                </Text>
                <DatePicker
                    style={{ width: 80 }}
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
                <Iconfont
                    icon={'e657'} // 图标
                    iconColor={'#aaa'}
                    iconSize={24} />
                <View style={{ flex: 1 }} />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 8, justifyContent: 'center', alignContent: 'center' }}>
                <View style={{ flex: 1 }} /><Text style={{ color: '#666', fontSize: 16 }}>{'排名前20'}</Text><View style={{ flex: 1 }} />
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                    <LeftTabComponet
                        data={this.state.listData}
                        sectionAction={(item) => {
                            let itemListData = item.customerList;
                            this.setState({ itemListData })
                        }}
                    />
                </View>
                <View style={{ flex: 1, padding: 10, backgroundColor: '#f2f2f2' }}>
                    <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'电话'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(万)'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比%'}</Text>
                        </View>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <LoadingListView
                            loading={this.state.loading}
                            listData={ds.cloneWithRows(this.state.itemListData)}
                            renderRowView={this._renderRow} />
                    </View>
                </View>
            </View>
        </View>;
    }
}


export default BigCustomerPage;

class LeftTabComponet extends React.Component {
    constructor(props) {
        super(props)
        this.renderSectionListItem = this.renderSectionListItem.bind(this);
        this.state = {
            preSelect: undefined
        }
        this.preSelect = undefined
    }
    sectionAction(item) {
        this.props.sectionAction && this.props.sectionAction(item)
        this.setState({ preSelect: item.productId })
    }
    renderSectionListItem(item,index) {
        let productId = item.productId;
        let preSelect = this.state.preSelect;
        if (!this.preSelect) {
            this.preSelect = productId
        }
        preSelect = preSelect ? preSelect : this.preSelect

        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${index}`}>
            <View>
                <View style={{ width: 80, padding: 10, backgroundColor: preSelect != productId ? '#fff' : '#f9f9f9' }}>
                    <ImageView source={{ uri: item.productImage }} style={{ width: 60, height: 60, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: 60, backgroundColor: '#f9f9f9' }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        return <ScrollView>
            {
                this.props.data.map((item,index) => this.renderSectionListItem(item,index))
            }
        </ScrollView>
    }
}
import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go';
import LoadingListView from '../../../../components/LoadingListView';
import ImageView from '../../../../components/ImageView';
import * as DateUtils from '../../../../utils/DateUtils'
import MonthPicker from '../../../../components/MonthPicker'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//产品销量
class MonthPage extends React.Component {
    constructor(props) {
        super(props)
        this.loadDetail = this.loadDetail.bind(this);
        this._renderBranchRow = this._renderBranchRow.bind(this);
        let seriesId = '';
        props.selectedIds.map((id)=>{
            seriesId += id+','
        });
        let {startDate,endDate} = DateUtils.getMonth();
        this.state = {
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
            orgName:undefined,
            groupLoading: false,
            WeekModelShow: false,
            selected: 0,
            startDate: startDate,
            endDate: endDate,
            salerSort: 'rise',
            seriesId
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        const userId = LoginInfo.getUserInfo().user_id;
        this.setState({ loading: true, groupLoading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getMyFocusFactory.page?userId=' + userId, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let orgId = undefined;
                    let orgName = undefined;
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        orgName = data[0].orgName;
                        const { seriesId, startDate, endDate, salerSort } = this.state;
                        this.loadDetail(orgId, seriesId, startDate, endDate, salerSort);
                    }
                    this.setState({ branchFactoryList: data, orgId,orgName, groupLoading: false, loading: false })

                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
            })
        });
    }
    componentWillReceiveProps(nextProps) {
        let seriesId = '';
        nextProps.selectedIds.map((id)=>{
            seriesId += id+','
        });
        const { orgId, startDate, endDate, salerSort } = this.state;
        this.loadDetail(orgId, seriesId, startDate, endDate, salerSort);
        this.setState({seriesId});
    }
    loadDetail(orgId, seriesId, startDate, endDate, salerSort) {
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { orgId: orgId, userId, seriesId, startDate, endDate, salerSort };
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearMonthProductSaler.page', p, 30 * 60).then((responseData) => {
                if (responseData.status == '0') {
                    let data = responseData.data;
                    let productdata = null;
                    if (data.length > 0) {
                        productdata = data[0].productdata
                    }
                    this.setState({ listData: data, productdata, loading: false, groupLoading: false })
                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
            })
        });
    }

    _rowOnBranchPress(item) {
        let branchFactoryList = this.state.branchFactoryList;
        branchFactoryList.map((_item) => {
            _item.selected = false;
            if (_item.orgId === item.orgId) {
                _item.selected = true;
            }
        })
        const { seriesId, startDate, endDate, salerSort } = this.state;
        let orgId = item.orgId;
        let orgName = item.orgName;
        this.loadDetail(orgId, seriesId, startDate, endDate, salerSort);
        this.setState({ branchFactoryList, orgId,orgName })
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
    onItemAction(index) {
        let salerSort = index == 0 ? 'rise' : 'fall';
        if(this.state.selected != index){
            this.setState({ selected: index, salerSort })
            const { orgId, seriesId, startDate, endDate } = this.state;
            this.loadDetail(orgId, seriesId, startDate, endDate, salerSort);
        }
    }
    onDetailAction(index,productId,productName) {
        console.log(index);
        const userId = LoginInfo.getUserInfo().user_id;
       // let productId = 102385;
        // let orgId = 109;
        // let startDate = '2017-12-01';
        // let endDate = '2017-12-07';
        // let userId = 100130;
        if (index == 2) {
            const { navigation } = this.props;
            const { orgId,orgName, startDate, endDate } = this.state;
            let custype = 0;
            navigation.navigate('ProductDetailPage', { orgId,orgName, startDate, endDate, custype, userId, productId,productName });
        } else if (index == 3) {
            const { navigation } = this.props;
            const { orgId,orgName, startDate, endDate } = this.state;
            let custype = 1;
            navigation.navigate('ProductDetailPage', { orgId,orgName, startDate, endDate, custype, userId, productId,productName });
        } else if (index == 4) {
            const { navigation } = this.props;
            const { orgId,orgName, startDate, endDate } = this.state;
            let custype = 2;
            navigation.navigate('ProductDetailPage', { orgId,orgName, startDate, endDate, custype, userId, productId,productName });
        } else if (index == 5) {
            const { navigation } = this.props;
            const { orgId,orgName, startDate, endDate } = this.state;
            navigation.navigate('DeliveryEmpDetails', { orgId,orgName, startDate, endDate, userId, productId,productName });
        } else if (index == 6) {
            const { navigation } = this.props;
            const { orgId,orgName, startDate, endDate } = this.state;
            navigation.navigate('TakeGoodsEmpDetails', { orgId,orgName, startDate, endDate, userId, productId,productName });
        }
    }
    render() {
        let productdata = this.state.productdata;
        let selected = this.state.selected;
        let itemConfig = [];
        if (productdata) {
            itemConfig = [
                ['销量 ', productdata.salerQuantity + '' + productdata.productUnit, selected == 0 ? '增长  ' : '下降  ', productdata.upOrdownQuantity + '' + productdata.productUnit],
                ['销售额￥ ', productdata.totalSum, selected == 0 ? '增长￥  ' : '下降￥', productdata.upOrdownSum],
                ['交易客户数 ', productdata.tradeCustomer + '家', '占总交易客户数 ', productdata.tradePrecent + ''],
                ['新增交易客户数 ', productdata.addTradeCustomer + '家', '占总交易客户数 ', productdata.addTradeCusPrecent + ''],
                ['新增并返单客户数 ', productdata.addReorderCustomer + '家', '占新增单客户数 ', productdata.addCusPrecent + ''],
                ['送货业务员 ', productdata.deliveryEmp + '人', '占带货业务员 ', productdata.takeGoodsPrecent + ''],
                ['带货业务员 ', productdata.takeGoodsEmp + '人', '占总开单业务员 ', productdata.totalBillingEmpPrecent + '']];
        }

        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{
                paddingBottom: 2,
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => {
                }}>
                    <Iconfont
                        icon={'e688'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </TouchableOpacity>
                <MonthPicker
                    style={{ width: 120 }}
                    customStyles={{
                        dateText: {
                            fontSize: 16,
                            color: '#666',
                        }
                    }}
                    selY={this.state.selY}
                    selM={this.state.selM}
                    onDateChange={(selY, selM, ymStr) => {
                        let startDate = selY + '-' + (selM < 10 ? '0' + selM : selM) + '-01'
                        let endDate  = selY + '-' + (selM < 10 ? '0' + selM : selM) + '-31'
                        this.setState({ startDate, endDate , selY, selM});
                        const { seriesId, salerSort, orgId } = this.state;
                        this.loadDetail(orgId, seriesId, startDate, endDate, salerSort);
                    }}
                />
                <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {
                }}>
                    <Iconfont
                        icon={'e657'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: 40, backgroundColor: '#fff' }}>
                <ListView
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(this.state.branchFactoryList)}
                    renderRow={this._renderBranchRow}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            <View style={{ padding: 12, flexDirection: 'row' }}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.onItemAction.bind(this, 0)}>
                    <View style={{ borderWidth: 1, borderColor: !this.state.selected ? '#61aee0' : '#f9f9f9', backgroundColor: !this.state.selected ? '#61aee0' : '#f9f9f9', borderRadius: 4, flexDirection: 'row' }}>
                        <Text style={{ padding: 8, color: this.state.selected ?  '#61aee0' : '#fff'}}>{'销量上升'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ width: 24 }} />
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.onItemAction.bind(this, 1)}>
                    <View style={{ borderWidth: 1, borderColor: this.state.selected ? '#61aee0' : '#f9f9f9', backgroundColor: this.state.selected ? '#61aee0' : '#f9f9f9', borderRadius: 4, flexDirection: 'row' }}>
                        <Text style={{ padding: 8, color: this.state.selected ? '#fff' : '#61aee0' }}>{'销量下降'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1, }} />
            </View>
            {
                this.state.groupLoading ? <LoadingView />
                    :
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <LeftTabComponet
                                data={this.state.listData}
                                sectionAction={(item) => {
                                    this.setState({ productdata: item.productdata });
                                }}
                            />
                        </View>
                        {
                            productdata ? <ScrollView style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'column' }}>
                                <View style={{ borderColor: '#e9e9e9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                                    <View style={{ height: 44, backgroundColor: '#f9f9f9', paddingLeft: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: '#333' }}>{`${productdata ? productdata.productName : ''}`}</Text>
                                    </View>
                                    {
                                        itemConfig.map((item, index) =>
                                            <TouchableOpacity key={`index_${index}`} onPress={this.onDetailAction.bind(this, index,productdata.productId,productdata.productName)}>
                                                <View style={{ padding: 8, height: 60 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ color: '#666', flex: 1 }}>{`${item[0]}`}</Text>
                                                        <Text style={{ color: '#666', flex: 1 }}>{`${item[1]}`}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                                        <Text style={{ color: '#666', flex: 1 }}>{`${item[2]}`}</Text>
                                                        <Text style={{ color: '#666', flex: 1 }}>{`${item[3]}`}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            </ScrollView>
                                : 
                            <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                <Text>无相关数据</Text>
                            </View>
                        }

                    </View>
            }
        </View>;
    }
}


export default MonthPage;

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
        this.setState({ preSelect: item.pName })
    }
    renderSectionListItem(item, index) {
        let pName = item.pName;
        let preSelect = this.state.preSelect;
        if (!this.preSelect) {
            this.preSelect = pName
        }
        preSelect = preSelect ? preSelect : this.preSelect

        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${index}`}>
            <View>
                <View style={{ width: 80, padding: 10, backgroundColor: preSelect != pName ? '#fff' : '#f9f9f9' }}>
                    <ImageView source={{ uri: item.pImage }} style={{ width: 60, height: 60, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                    <Text>{item.pName}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: 60, backgroundColor: '#f9f9f9' }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        return <ScrollView>
            {
                this.props.data.map((item, index) => this.renderSectionListItem(item, index))
            }
        </ScrollView>
    }
}


const styles = StyleSheet.create({
    iconStyle: {
        width: 26,
        height: 26,
    },
    textStyle: {
        color: '#666',
        marginBottom: 6,
    },
    selectedTextStyle: {
        color: '#42beff',
        marginBottom: 6,
    }, tabs: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
        width: 180,
        flexDirection: 'row',
    },
    tab: {
        height: 30,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem0: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,

    },
    tabItem1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
    },
    tabItem2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },

});
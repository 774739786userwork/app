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
import * as DateUtils from '../../../utils/DateUtils';
import MonthPicker from '../../../components/MonthPicker';
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//产品业务员
class ProductCustomerPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `产品业务员`,
    });

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this._renderBranchRow = this._renderBranchRow.bind(this);
        this._rowOnBranchPress = this._rowOnBranchPress.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        let { year, month } = DateUtils.yearMonth();
        this.state = {
            selY: year, selM: month,
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
            groupLoading: false,
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
                    const { selY, selM, orgId } = this.state;
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        this.loadDetail(selY, selM, orgId);
                    }
                    this.setState({ branchFactoryList: data, orgId, groupLoading: false, loading: false })

                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
            })
        });


    }
    loadDetail(_year, _month, orgId) {
        let currTime = _year + '-' + (_month < 10 ? '0' + _month : _month)
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { currTime, type: 1, orgId, userId };
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getProductEmployee.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let itemListData = [];
                    let productId = '';
                    if (data && data.length > 0) {
                        itemListData = data[0].empList;
                        productId = data[0].productId;
                    }
                   
                    this.setState({ listData: data, itemListData,productId, loading: false, groupLoading: false })
                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
            })
        });
    }
    onItemAction(item) {
        const { navigate } = this.props.navigation;
        const { orgId,selY, selM,productId} = this.state;
        let currTime = selY + '-' + (selM < 10 ? '0' + selM : selM)
        item.orgId = orgId;
        item.currTime = currTime;
        item.type = 1;
        item.productId = productId;
        item.userId = LoginInfo.getUserInfo().user_id;
        navigate('ProductCustomerDetailPage', item);
    }

    _renderRow(item, rowID) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${rowID}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.empName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.empSalerGroup}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSales}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.ranking}`}</Text>
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
        const { selY, selM } = this.state;
        let orgId = item.orgId;
        this.loadDetail(selY, selM, orgId);

        this.setState({ branchFactoryList, orgId })
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

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 40, backgroundColor: '#fff' }}>
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
                <MonthPicker
                    style={{ width: 120 }}
                    customStyles={{
                        dateText: {
                            fontSize: 18,
                            color: '#000',
                        }
                    }}
                    selY={this.state.selY}
                    selM={this.state.selM}
                    onDateChange={(selY, selM, ymStr) => {
                        this.loadDetail(selY, selM, this.state.orgId)
                        this.setState({ selY, selM })
                    }}
                />
                <Iconfont
                    icon={'e657'} // 图标
                    iconColor={'#aaa'}
                    iconSize={24} />
                <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            {
                this.state.groupLoading ? <LoadingView />
                    :
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <LeftTabComponet
                                data={this.state.listData}
                                sectionAction={(item) => {
                                    let itemListData = item.empList;
                                    let productId = item.productId;
                                    this.setState({ itemListData,productId })
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, padding: 10, backgroundColor: '#f2f2f2' }}>
                            <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'业务员'}</Text>
                                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'组'}</Text>
                                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销量'}</Text>
                                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(元)'}</Text>
                                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'排名'}</Text>
                                </View>
                                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                                <LoadingListView
                                    loading={this.state.loading}
                                    listData={ds.cloneWithRows(this.state.itemListData)}
                                    renderRowView={this._renderRow} />
                            </View>
                        </View>
                    </View>
            }
        </View>;
    }
}


export default ProductCustomerPage;

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
    renderSectionListItem(item, index) {
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
                    <Text>{item.productName}</Text>
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
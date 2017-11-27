//产品销量
//
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
import LoadingListView from '../../../components/LoadingListView';
import ImageView from '../../../components/ImageView';
import * as DateUtils from '../../../utils/DateUtils'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//产品销量主页面
class ProductSalesPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `产品销量`,
    });

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this._renderBranchRow = this._renderBranchRow.bind(this);
        this._rowOnBranchPress = this._rowOnBranchPress.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.renderTabBar = this.renderTabBar.bind(this)
        this.ontabSelect = this.ontabSelect.bind(this)
        this._selectByDate = this._selectByDate.bind(this);
        this.state = {
            startDate: DateUtils.getYearMonthDay(1),
            endDate: DateUtils.getYearMonthDay(),
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
            groupLoading: false,
            activeTab: 0,
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
                    const { startDate, endDate } = this.state;
                    let orgId = undefined;
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        this.loadDetail(startDate, endDate, orgId);
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
    loadDetail(startDate, endDate, orgId) {
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { startDate, endDate, orgId, userId };
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getProductBigCustomer.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let itemListData = [];
                    if (data && data.length > 0) {
                        itemListData = data[0].customerList;
                    }
                    this.setState({ listData: data, itemListData, loading: false, groupLoading: false })
                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
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

    _selectByDate(_startDate, _endDate) {
        let orgId = this.state.orgId;
        const { startDate, endDate } = this.state;

        if (_startDate) {
            this.loadDetail(_startDate, endDate, orgId);
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            this.loadDetail(startDate, _endDate, orgId);
            this.setState({ endDate: _endDate });
        }
    }
    ontabSelect(index) {
        this.setState({activeTab:index});
    }
    renderTabBar() {
        let activeTab = this.state.activeTab;
       
        let color0 = activeTab === 0 ? "#0081d4" : "#fff";
        let tColor0 = activeTab === 0 ? "#fff" : "#0081d4";
        let color1 = activeTab === 1 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor1 = activeTab ===1 ? "#fff" : "#0081d4";
        let color2 = activeTab === 2 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor2 = activeTab === 2 ? "#fff" : "#0081d4";
        return (
            <View style={{
                height: 48, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', elevation: 5,
            }}>
                <View style={{ flex: 1 }} />
                <View style={styles.tabs}>
                    <TouchableWithoutFeedback onPress={() => this.ontabSelect(0)} style={styles.tab}>
                        <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
                            <Text style={{ color: tColor0 }}>
                                周
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.ontabSelect(1)} style={styles.tab}>
                        <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
                            <Text style={{ color: tColor1 }}>
                                月
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.ontabSelect(2)} style={styles.tab}>
                        <View style={[styles.tabItem2, { backgroundColor: color2 }]} >
                            <Text style={{ color: tColor2 }}>
                                季
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 1 }} />
                
                <View style={{ flex: 1 }} />
            </View>
        );

    }
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            {
                this.renderTabBar()
            }
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
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            {
                this.state.groupLoading ? <LoadingView />
                    :
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
                                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(元)'}</Text>
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
            }
        </View>;
    }
}


export default ProductSalesPage;

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
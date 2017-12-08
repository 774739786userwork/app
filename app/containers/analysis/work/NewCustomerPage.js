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
    ScrollView,
    Dimensions
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go';
import LoadingListView from '../../../components/LoadingListView';
import ImageView from '../../../components/ImageView';
import * as DateUtils from '../../../utils/DateUtils'
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//新发展客户
class NewCustomerPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `新发展客户`,
    });

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.renderTabBar = this.renderTabBar.bind(this)
        this.ontabSelect = this.ontabSelect.bind(this)
        let { year, month } = DateUtils.yearMonth();
        this.state = {
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
            orgName: '',
            groupLoading: false,
            activeTab: 0,
            selectNew: true,
            loading: false,
            totalCustomerBase: 0,
            selY: year, selM: month
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
                    let orgName = '';
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        orgName = data[0].orgName;
                        const { selectNew, activeTab } = this.state
                        this.loadDetail(orgId, activeTab, selectNew)
                    }
                    this.setState({ branchFactoryList: data, orgId, orgName, groupLoading: false, loading: false })

                } else {
                    this.setState({ loading: false, groupLoading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false, groupLoading: false });
            })
        });
    }
    loadDetail(orgId, activeTab, selectNew) {
        let selY = this.state.selY;
        let selM = this.state.selM;
        let param = {};
        param.orgId = orgId;
        param.type = activeTab;
        if(param.type === 0){
            param.currTime =  selY;
        }else{
            param.currTime =  selY + '-' + (selM < 10 ? '0' + selM : selM)
        }
        param.customerType = selectNew ? 'new' : 'old';
        param.userId = LoginInfo.getUserInfo().user_id;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getNewCustomer.page', param, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ listData: data, totalCustomerBase: responseData.totalCustomerBase, loading: false })

                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    //人员选择
    onItemAction(item) {
        const { navigation } = this.props;
        const { orgId, activeTab, orgName, selectNew,selY, selM} = this.state
        item.orgId = orgId;
        item.orgName = orgName;
        item.type = activeTab;
        if(item.type === 0){
            item.currTime =  selY;
        }else{
            item.currTime =  selY + '-' + (selM < 10 ? '0' + selM : selM)
        }
        item.customerType = selectNew ? 'new' : 'old';
        navigation.navigate('NewCustomerDetailPage', item)
    }

    _renderRow(item, rowID, index) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${index}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.employeeName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerBase}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.ranking}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                </View>
            </TouchableOpacity>);
    }

    swithItemPress(selectNew) {

        this.setState({ selectNew: !selectNew ? true : false })
        const { orgId, activeTab } = this.state
        this.loadDetail(orgId, activeTab, !selectNew)
    }
    ontabSelect(index) {
        this.setState({ activeTab: index });
        const { orgId, selectNew } = this.state
        this.loadDetail(orgId, index, selectNew)
    }
    renderTabBar() {
        let activeTab = this.state.activeTab;
        let color0 = activeTab === 0 ? "#0081d4" : "#fff";
        let tColor0 = activeTab === 0 ? "#fff" : "#0081d4";
        let color1 = activeTab === 1 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor1 = activeTab === 1 ? "#fff" : "#0081d4";
        return (
            <View style={{
                height: 48, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{ flex: 1 }} />
                <View style={styles.tabs}>
                    <TouchableWithoutFeedback onPress={() => this.ontabSelect(0)} style={styles.tab}>
                        <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
                            <Text style={{ color: tColor0 }}>
                                年
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.ontabSelect(1)} style={styles.tab}>
                        <View style={[styles.tabItem2, { backgroundColor: color1 }]} >
                            <Text style={{ color: tColor1 }}>
                                月
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 1 }} />
            </View>
        );

    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            {
                this.renderTabBar()
            }
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                    <LeftTabComponet
                        data={this.state.branchFactoryList}
                        sectionAction={(item) => {
                            const { activeTab, selectNew } = this.state
                            this.setState({ orgId: item.orgId, orgName: item.orgName });
                            this.loadDetail(item.orgId, activeTab, selectNew)
                        }}
                    />
                </View>
                <View style={{ width: WINDOW_WIDTH - 80, backgroundColor: '#f2f2f2' }}>
                    <View style={{ flexDirection: 'row', margin: 12 }}>
                        <Text style={{ fontSize: 12, color: '#666' }}>{`总计客户数:${this.state.totalCustomerBase}家`}</Text>
                    </View>
                    <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10 }}>
                        <View style={{ height: 38, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 38 }}>
                                <TouchableOpacity style={{ flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' }} onPress={this.swithItemPress.bind(this, 0)}>
                                    <Text style={{ color: this.state.selectNew ? '#0081d4' : '#222' }}>{'新建档'}</Text>
                                </TouchableOpacity>
                                <View style={{ height: 1, backgroundColor: this.state.selectNew ? '#0081d4' : '#c4c4c4', width: (WINDOW_WIDTH - 100) / 2 }} />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 38 }}>
                                <TouchableOpacity style={{ flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' }} onPress={this.swithItemPress.bind(this, 1)}>
                                    <Text style={{ color: !this.state.selectNew ? '#0081d4' : '#222' }}>{'已归档'}</Text>
                                </TouchableOpacity>
                                <View style={{ height: 1, backgroundColor: !this.state.selectNew ? '#0081d4' : '#c4c4c4', width: (WINDOW_WIDTH - 100) / 2 }} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'业务员'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户数'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'排名'}</Text>
                        </View>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />

                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, marginBottom: 8, justifyContent: 'center', alignContent: 'center' }}>
                        {
                            this.state.loading ? <LoadingView />
                                : <ListView
                                    enableEmptySections={true}
                                    dataSource={ds.cloneWithRows(this.state.listData)}
                                    renderRow={this._renderRow}
                                />
                        }
                    </View>
                </View>

            </View>
        </View>;
    }
}


export default NewCustomerPage;
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
        this.setState({ preSelect: item.orgId })
    }
    renderSectionListItem(item, index) {
        let orgId = item.orgId;
        let preSelect = this.state.preSelect;
        if (!this.preSelect) {
            this.preSelect = orgId
        }
        preSelect = preSelect ? preSelect : this.preSelect

        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${index}`}>
            <View>
                <View style={{ width: 80, padding: 10, height: 60, justifyContent: 'center', backgroundColor: preSelect != orgId ? '#fff' : '#f9f9f9' }}>
                    <Text style={{ color: preSelect != orgId ? '#333' : '#0081d4' }}>{item.orgName}</Text>
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
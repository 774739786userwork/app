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
import YearPicker from '../../../../components/YearPicker'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

//大客户排名
class BigCustomerSortPage extends React.Component {
    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.state = {
            startDate: DateUtils.getYearMonthDay(1),
            endDate: DateUtils.getYearMonthDay(),
            listData: [],
            itemListData: [],
            branchFactoryList: [],
            loading: false,
            orgId: undefined,
            orgName:undefined,
            groupLoading: false,
            activeTab: props.activeTab,
            rankModelShow: false,
            currTime: DateUtils.getYearMonth()
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
                        const { activeTab, currTime } = this.state;
                        this.loadDetail(orgId, activeTab, currTime);
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
    loadDetail(orgId, activeTab, currTime) {
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { orgId, userId };
        p.currTime = currTime;
        p.type = activeTab;
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getSumPartCustomer.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ listData: data, loading: false, groupLoading: false })
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
        const { activeTab, orgId, orgName, currTime } = this.state;
        item.orgId = orgId;
        item.orgName = orgName;
        item.currTime = currTime;
        item.type = activeTab;
        item.userId = LoginInfo.getUserInfo().user_id;
        navigate('SumPartDetailPage', item);
    }

    _renderRow(item, rowID,index) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${index}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.sumPart}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerBase}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.precent}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                </View>
            </TouchableOpacity>);
    }
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{
                paddingTop: 6,
                paddingBottom: 6,
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
                        let month = selY + '-' + (selM < 10 ? '0' + selM : selM)
                        const { orgId, activeTab } = this.state;
                        this.loadDetail(orgId, activeTab, month)
                        this.setState({ currTime: month, selY, selM })
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
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            {
                this.state.groupLoading ? <LoadingView />
                    :
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <LeftTabComponet
                                data={this.state.branchFactoryList}
                                orgId={this.state.orgId}
                                sectionAction={(item) => {
                                    this.setState({ orgId: item.orgId,orgName:item.orgName })
                                    const { activeTab, currTime } = this.state;
                                    this.loadDetail(item.orgId, activeTab, currTime);
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, padding: 10, backgroundColor: '#f2f2f2' }}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                            <Text style={{ fontSize: 12, paddingLeft: 1, paddingTop: 10, paddingBottom: 10,textAlign: 'center', flex: 1, color: '#fff' }}>{'分段金额（万）'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center',color: '#fff' }}>{'客户数'}</Text>
                            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                            <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比（%）'}</Text>
                        </View>
                        <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                            <LoadingListView
                                loading={this.state.loading}
                                listData={ds.cloneWithRows(this.state.listData)}
                                renderRowView={this._renderRow} />
                        </View>
                        </View>
                    </View>
            }
        </View>;
    }
}


export default BigCustomerSortPage;

class LeftTabComponet extends React.Component {
    constructor(props) {
        super(props)
        this.renderSectionListItem = this.renderSectionListItem.bind(this);
        this.state = {
            preSelect: this.props.orgId
        }
        this.preSelect = this.props.orgId
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
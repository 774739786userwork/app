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
import RankModel from './model/RankModel'
import MonthPicker from '../../../components/MonthPicker'
import YearPicker from '../../../components/YearPicker'

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
            groupLoading: false,
            activeTab: props.activeTab,
            rankModelShow: false,
            rankName: '排名前20',
            currTime: DateUtils.getYearMonth(),
            rankId: 1
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
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        const { activeTab, rankId, currTime } = this.state;
                        this.loadDetail(orgId, activeTab, rankId, currTime);
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
    loadDetail(orgId, activeTab, rankId, currTime) {
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { orgId, userId };
        p.rankId = rankId;
        p.currTime = currTime;
        p.type = activeTab;
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getBigCustomerRanking.page', p, 30 * 60).then((responseData) => {
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
        const { activeTab, orgId, currTime } = this.state;
        item.orgId = orgId;
        item.currTime = currTime;
        item.type = activeTab;
        item.userId = LoginInfo.getUserInfo().user_id;
        navigate('BigCustSortDetailPage', item);
    }

    _renderRow(item, rowID) {
        return (<View key={`index_${rowID}`}>
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} >
                <View style={{ borderRadius: 4, backgroundColor: '#fff' }}>
                    <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', }}>{`${item.customerName}`}</Text>
                        <Text style={{ color: '#333', marginLeft: 8 }}>{`${item.customerPhone}`}</Text>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 3, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{'金额：'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.totalSum}元`}</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{'未收：'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12, marginRight: 4 }}>{`${item.unPaidSum}元`}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ height: 12, backgroundColor: '#f2f2f2' }}></View>
        </View>
        );
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
                        const { orgId, activeTab, rankId } = this.state;
                        this.loadDetail(orgId, activeTab, rankId, month)
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

                <View style={{ marginLeft: 4 }} >
                    <Iconfont
                        icon={'e688'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ rankModelShow: true }) }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666', fontSize: 16 }}>{this.state.rankName}</Text></View>
                </TouchableOpacity>
                <View style={{ marginLeft: 4 }} >
                    <Iconfont
                        icon={'e657'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </View>
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
                                    this.setState({ orgId: item.orgId })
                                    const { activeTab, rankId, currTime } = this.state;
                                    this.loadDetail(item.orgId, activeTab, rankId, currTime);
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, padding: 10, backgroundColor: '#f2f2f2' }}>
                            <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                                <LoadingListView
                                    loading={this.state.loading}
                                    listData={ds.cloneWithRows(this.state.listData)}
                                    renderRowView={this._renderRow} />
                            </View>
                        </View>
                    </View>
            }
            <RankModel modalVisible={this.state.rankModelShow} onCancelPress={() => {
                this.setState({
                    rankModelShow: false,
                })
            }}
                onConfirmPress={
                    (rank) => {
                        this.setState({
                            rankName: rank.rankName,
                            rankId: rank.rankId,
                            rankModelShow: false,
                        })
                        const { orgId, activeTab,currTime } = this.state;
                        this.loadDetail(orgId, activeTab, rank.rankId,currTime);
                    }
                } />
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
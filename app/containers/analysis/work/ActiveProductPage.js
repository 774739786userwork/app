//客户产品系列
import React from 'react';
import {
    View,
    Text,
    InteractionManager,
    ListView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView, {
    ScrollableTabBar
} from 'react-native-scrollable-tab-view';

import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../components/LoadingListView'
import ImageView from '../../../components/ImageView'
import CycleTypeModel from './model/CycleTypeModel'
import TimesModel from './model/TimesModel'
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
/**
 * '活跃客户'*/
class ActiveProductPage extends React.Component {
    static navigationOptions = {
        title: '活跃客户'
    };

    constructor(props) {
        super(props);
        this.state = {
            branchFactoryList: [],

        }
    }


    componentDidMount() {
        const { navigation, tabLabel } = this.props;
        let userId = LoginInfo.getUserInfo().user_id;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getMyFocusFactory.page', { userId }, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    const { currentDate, orgId, orgName } = this.state;
                    if (data.length > 0) {
                        data[0].selected = true;
                        orgId = data[0].orgId;
                        orgName = data[0].orgName;

                    }
                    this.setState({ branchFactoryList: data, orgId, orgName, loading: false })

                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }

    render() {
        return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar textStyle={{ fontSize: 16 }} />
                )}
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"
                locked={true}>
                {
                    this.state.branchFactoryList.map((item, index) => <CustomerSaleDetailPage key={index} itemId={item.orgId} tabLabel={item.orgName} {...this.props} />)
                }
            </ScrollableTabView>
        </View>);
    }
}
export default ActiveProductPage;


//查询该组或者个人客户销售情况
class CustomerSaleDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let title = state.params.currTime + state.params.groupName + '客户销售情况';

        return {
            headerTitleStyle: { fontSize: 16 },
            title: title
        };
    };

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.onItemAction = this.onItemAction.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.state = {
            dataList: [],
            loading: false,
            cycleId: 1,
            cycleName: '近一月',
            cycleTypeModelShow: false,
            timesId: 3,
            timmesName: '5次以上',
            timesModelShow: false,
        }
    }
    componentDidMount() {
        const { cycleId, timesId } = this.state
        this.loadDetail(cycleId, timesId);

    }
    loadDetail(cycleId, timesId) {
        let params = {};
        const orgId = this.props.itemId;
        params.orgId = orgId;
        params.cycleId = cycleId;
        params.timesId = timesId;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getCustomerVitalityDetail.page', params, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ dataList: data, loading: false })
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

    _renderRow(item, rowID, index) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${index}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPhone}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}元`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.purchaseDate}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, width: 38, textAlign: 'center', color: '#666' }}>{`${item.purchaseTimes}`}</Text>

                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                </View>
            </TouchableOpacity>);
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ backgroundColor: '#fff',padding:8, flexDirection: 'row', }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                    <View style={{ justifyContent: 'center', alignContent: 'center', height: 36, }}><Text style={{ color: '#999' }}>{'  周  期:'}</Text></View>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                        this.setState({ cycleTypeModelShow: true })
                    }}>
                        <View style={{ flex: 1, backgroundColor: '#f2f2f2', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', paddingLeft: 4, height: 28 }}>
                            <View style={{ justifyContent: 'center', alignContent: 'center', height: 36, }}><Text style={{ color: '#999' }}>{this.state.cycleName}</Text></View><View style={{ flex: 1 }} /><View><Iconfont icon={'e686'} iconColor={'#aaa'} /></View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{width:8}}/>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ justifyContent: 'center', alignContent: 'center', height: 36, }}><Text style={{ color: '#999' }}>{'进货次数:'}</Text></View>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                        this.setState({ timesModelShow: true })
                    }}>
                        <View style={{ flex: 1, height: 36, backgroundColor: '#f2f2f2', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', paddingLeft: 4, height: 28 }}>
                            <View style={{ justifyContent: 'center', alignContent: 'center', height: 36, }}><Text style={{ color: '#999' }}>{this.state.timmesName}</Text></View><View style={{ flex: 1 }} /><View><Iconfont icon={'e686'} iconColor={'#aaa'} /></View>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'电话'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'总销售额'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'最近时间'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, width: 38, textAlign: 'center', color: '#fff' }}>{'次数'}</Text>

                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <LoadingListView
                    loading={this.state.loading}
                    listData={ds.cloneWithRows(this.state.dataList)}
                    renderRowView={this._renderRow} />
            </View>
            <CycleTypeModel modalVisible={this.state.cycleTypeModelShow} onCancelPress={() => {
                this.setState({
                    cycleTypeModelShow: false,
                })
            }}
                onConfirmPress={
                    (item) => {
                        this.setState({
                            cycleId: item.cycleId,
                            cycleName: item.cycleName,
                            cycleTypeModelShow: false,
                        })
                        const { timesId } = this.state
                        this.loadDetail(item.cycleId, timesId);
                    }
                } />
            <TimesModel modalVisible={this.state.timesModelShow} onCancelPress={() => {
                this.setState({
                    timesModelShow: false,
                })
            }}
                onConfirmPress={
                    (item) => {
                        this.setState({
                            timesId: item.timesId,
                            timmesName: item.timesName,
                            timesModelShow: false,
                        })
                        const { cycleId } = this.state
                        this.loadDetail(cycleId, item.timesId);
                    }
                } />
        </View>;
    }
}


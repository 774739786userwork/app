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
import Orientation from 'react-native-orientation';
import Echarts from 'native-echarts';

//产品趋势
class ProductChartPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `产品趋势`,
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
        Orientation.lockToLandscape();
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
        let currTime = _year
        const userId = LoginInfo.getUserInfo().user_id;
        let p = { currTime, type: 1, orgId, userId };
        this.setState({ groupLoading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearProductChart.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let itemListData = [];
                    if (data && data.length > 0) {
                        itemListData = data[0].monthList;
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
        const { navigate } = this.props.navigation;
        const { orgId, selY, selM, productId } = this.state;
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
        const itemListData = this.state.itemListData;
        const xdataList = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
        const ydataList = [];
        for (var i = 0; i < xdataList.length; i++) {
            let month = xdataList[i];
            let monthtotalSum = '';
            itemListData.map((item) => {
                if(month == item.monthname){
                    monthtotalSum = item.monthtotalSum;
                }
            });
            ydataList.push(monthtotalSum);
        }
        console.log(ydataList);
       
        const option = {
            tooltip: {    //点击弹框
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto'
                },
                axisTick: {
                    show: 'false',
                    alignWithLabel: true
                },
                //x轴数据
                data: xdataList
            },
            yAxis: {},
            color: ['#ee5f8f'],
            series: [{
                type: 'line',
                data: ydataList,
            }]
        };
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
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            {
                this.state.groupLoading ? <LoadingView />
                    :
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <LeftTabComponet
                                data={this.state.listData}
                                sectionAction={(item) => {
                                    let itemListData = item.monthList;
                                    this.setState({ itemListData })
                                }}
                            />
                        </View>
                        <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#f2f2f2' }}>
                            <Echarts option={option} height={300} />
                        </ScrollView>
                    </View>
            }
        </View>;
    }
    componentWillUnmount() {
        Orientation.lockToPortrait();
    }
}


export default ProductChartPage;

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
import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../../components/LoadingListView'
import ImageView from '../../../../components/ImageView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//进货
class JinHuoDetailPage extends React.Component {

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderGroup = this._renderGroup.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        let p = {};
        p.currTime = 2017;
        p.orgId = 109;
        p.customerId = 85065453;
        p.type = 1;
        //dataCenter/appHomePage/getBigCustomerSupply.page?type=1&currTime=2017-10&orgId=108&customerId=108850591 
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getBigCustomerSupply.page', p, 30 * 60).then((responseData) => {
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
    _rowOnPress(employeeId, employeeName, item) {
        const { navigation } = this.props;
        let param = navigation.state.params;
        param.employeeId = employeeId;
        param.employeeName = employeeName;
        param.seriesName = item.seriesName;
        param.seriesId = item.seriesId;
        navigation.navigate('ProductSaleDetailPage', param)
    }
    _onCustomerSaleDetailPress(item) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        let param = { type: params.type, currTime: params.currTime, employeeId: item.employeeId, groupName: item.employeeName };
        navigation.navigate('CustomerSaleDetailPage', param)
    }


    _renderGroup(item, sectionID, index) {
        let employeeId = item.employeeId;
        let employeeName = item.employeeName;
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ padding: 8, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.employeeName}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#FF33FF', marginRight: 4, }}>{`2017-10-11`}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.seriesName}：`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.seriesSalerSum}万元`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`单位`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.seriesSalerSum}万元`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`送货人`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.seriesSalerSum}万元`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000', fontSize: 13 }}>{`总价`}</Text>
                        <Text style={{ color: '#f80000', fontSize: 13 }}>{`${item.seriesSalerSum}万元`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000', fontSize: 13 }}>{`未收`}</Text>
                        <Text style={{ color: '#f80000', fontSize: 13 }}>{`${item.seriesSalerSum}万元`}</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#999', }}>{`进货数据分析`}</Text>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000', }}>{'平均进货周期：'}</Text>
                    <Text style={{ color: '#f80000', }}>{`${this.state.productsCovering}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000' }}>{'平均进货总额：'}</Text>
                    <Text style={{ color: '#f80000', marginRight: 4 }}>{`0`}</Text>
                </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000', }}>{'最长进货间隔：'}</Text>
                    <Text style={{ color: '#f80000', }}>{`${this.state.productsCovering}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000' }}>{'最近进货间隔：'}</Text>
                    <Text style={{ color: '#f80000', marginRight: 4 }}>{`0`}</Text>
                </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', marginBottom: 12, paddingLeft: 12, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000', }}>{'配送工厂：'}</Text>
                    <Text style={{ color: '#f80000', }}>{`${this.state.productsCovering}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#f80000' }}>{'同产品不同业务员：'}</Text>
                    <Text style={{ color: '#f80000', marginRight: 4 }}>{`0`}</Text>
                </View>
            </View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default JinHuoDetailPage;
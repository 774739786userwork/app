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
class QiTaPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            cusList: [],
            salerList:[],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        let p = {};
        p.currTime = '2017-10';
        p.orgId = 108;
        p.customerId = 108850591;
        p.type = 0;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getBigCustomerOther.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData;
                    this.setState({ salerList: data.salerList,cusList:data.cusList, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    _renderCusListRow(item, rowID) {
        return <View key={`index_${rowID}`}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerName}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPhone}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.salesVolume}元`}</Text>
         </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
    </View>;
    }
    _renderSalerListRow(item, rowID) {
        return <View key={`index_${rowID}`}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.salerName}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSalesVolume}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.precent ? item.precent : 0}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.deliveryStatus}`}</Text>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
    </View>;
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#999', }}>{`与相关客户情况`}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, backgroundColor: '#66b3e5' }}>
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'电话'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销售总额'}</Text>
            </View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.cusList)}
                renderRowView={this._renderCusListRow} />
            <View style={{ height: 24, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#999', }}>{`与其他业务员情况`}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, backgroundColor: '#66b3e5' }}>
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'姓名'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销售总额'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'进货'}</Text>
            </View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.salerList)}
                renderRowView={this._renderSalerListRow} />
        </View>;
    }
}
export default QiTaPage;
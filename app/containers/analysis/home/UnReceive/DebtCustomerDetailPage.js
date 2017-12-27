/**
 * 欠款客户明细
 */
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

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//查询该组或者个人客户销售情况
class DebtCustomerDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let title = '北厂张勇客户未收详细';

        return {
            headerTitleStyle: {fontSize: 16},
            title: title
        };
    };

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }

    componentDidMount() {
        this._onNativeData();
    }

    _onNativeData(){
        let data = [];
        let item = {
            "customerId": "80101023",
            "customerName": "兴达水暖电料五交化",
            "customerPhone": "13874815566",
            "unPaidDate": "2017-10-02",
            "promiseDate": "2017-12-15",
            "debtSum": "3370元"
        }
        for(var i = 0;i < 5; i++){
            data.push(item);
        }
        this.setState({dataList:data})
    }

    _renderRow(item, rowID) {
        return (
            <View key={`row_${rowID}`} >
                <View style={{ flexDirection: 'row', backgroundColor: '#fff' }} >
                    <Text style={{ fontSize: 12,paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerName}`}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12,paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPhone}`}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12,paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.unPaidDate}`}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12,paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.promiseDate}`}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12,paddingTop: 10, paddingBottom: 10, flex: 1,textAlign: 'center', color: '#666' }}>{`${item.debtSum}`}</Text>
                
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            </View>);
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                    <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'电话'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'挂欠款日期'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'回款日期'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'欠款余额'}</Text>
           
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <LoadingListView
                    loading={this.state.loading}
                    listData={ds.cloneWithRows(this.state.dataList)}
                    renderRowView={this._renderRow} />
            </View>
        </View>;
    }
}
export default DebtCustomerDetailPage;
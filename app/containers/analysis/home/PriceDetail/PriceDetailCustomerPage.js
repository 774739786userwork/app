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
//最高价 最低价 客户

class PriceDetailCustomerPage extends React.Component {

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            dataList: [],
            loading: false,
            xlLevel:props.xlLevel,
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData(){
        const {xlLevel} = this.state
        const { params } = this.props.navigation.state;
        let param = params.param;
        if(param.xlLevel === 1){
            param.productId = "";
        }else if (param.xlLevel === 2 || xlLevel === 2){
            param.seriesId = "";
            param.productId = param.productId;
        }
        if(param.year){
            param.currTime = param.year;
        }
        if(param.month){
            param.currTime = param.month;
        }
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearCustomerPriceDetail.page', param, 30 * 60).then((responseData) => {
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
    _rowOnPress(item) {

    }
    _renderRow(item, sectionID, index) {
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10, borderRadius: 4, backgroundColor: '#fff' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', }}>{`${item.customerName}`}</Text>
                        </View>
                        <View style={{ height: 24, paddingLeft: 12, paddingBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 3, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{`${item.HighestLowestPrice}`}</Text>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{'销量：'}</Text>
                                <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.customerSales}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 24, paddingLeft: 12, paddingBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{'最近时间：'}</Text>
                                <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.lastPurchaseDate}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
   
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderRow} />
        </View>;
    }
}
export default PriceDetailCustomerPage;
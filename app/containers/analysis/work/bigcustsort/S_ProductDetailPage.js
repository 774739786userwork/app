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
//销售总额明细 产品
class S_ProductDetailPage extends React.Component {

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        // let p = { orgId: params.factoryId, type: params.type, seriesId: params.seriesId,currTime:params.currTime };
        let p = {};
        p.currTime = 2017;
        p.orgId = 109;
        p.customerId = 85065453;
        p.type = 0;
        this.setState({ loading: true });
        //dataCenter/appHomePage/getBigCustomerProduct.page?currTime=2017-10&orgId=109&customerId=85065453&type=1
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getBigCustomerProduct.page', p, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ dataList: responseData.data, loading: false })
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
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView source={{ uri: item.productImage }} style={{ width: 80, height: 80, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{`${item.productName}`}</Text>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销量：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.salesSum}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销售额：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.salesVolume}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'单价：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.price}元`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'占客户额：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.customerPrecent}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{'总销售额:'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.totalSalesVolume ? item.totalSalesVolume : 0}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{'总额占比:'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.totalSumPrecent ? item.totalSumPrecent : 0}`}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
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
export default S_ProductDetailPage;
import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    ImageView,
    Text,
    InteractionManager,
    TouchableOpacity
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../../components/LoadingListView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let colorArr = ['#8855fa', '#fc2e9d', '#18c5c1', '#f8ae0f', '#ea325e', '#60c43a'];
//销售总额明细 系列
class S_SeriesDetailPage extends React.Component {

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataList: [],
            totalSum: 0,
            productsCovering: 0,
            seriesCovering:0,
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        let param = {};
        param.currTime = params.currTime;
        param.orgId = params.orgId;;
        param.type = params.type;;
        param.customerId = params.customerId;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getBigCustomerSeries.page', param, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ dataList: data.seriesList, totalSum: data.totalSum, productsCovering: data.productsCovering,seriesCovering:data.seriesCovering, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    _rowOnPress(item) {
        const { navigation } = this.props;
        let param = navigation.state.params.param
        param.seriesId = item.seriesId;
        param.seriesName = item.seriesName;
        navigation.navigate('PriceDetailPage', { param });
    }
    _rowSalesPress(item) {
        const { navigation } = this.props;
        let param = navigation.state.params.param
        param.seriesId = item.seriesId;
        param.seriesName = item.seriesName;
        navigation.navigate('S_ProductlPage', { param });
    }
    getColor(index) {
        let i = parseInt(index) + colorArr.length;
        i = i % colorArr.length;
        return colorArr[i];
    }
    _renderRow(item, sectionID, rowID) {
        return (<View key={`row_${rowID}`} style={{ borderColor: '#e9e9e9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
            <View style={{ height: 34, backgroundColor: '#f9f9f9', paddingLeft: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#333' }}>{`${item.seriesName}`}</Text>
            </View>
            <View style={{ paddingLeft: 10, paddingBottom: 8, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <View style={{ backgroundColor: this.getColor(rowID), justifyContent: 'center', padding: 2, width: 60, height: 60, borderRadius: 30 }}>
                        <Text style={{ color: '#fff', textAlign: 'center', margin: 2, }}>{`${item.seriesName}`}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'销售额:'}</Text>
                            <Text style={{ color: '#666', }}>{`${item.salesVolume}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'覆盖产品：'}</Text>
                            <Text style={{ color: '#666', marginRight: 4 }}>{`${item.coverProduct}`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1,flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'系列占比：'}</Text>
                            <Text style={{ color: '#666', }}>{`${item.seriesPrecent}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'平均价格：'}</Text>
                            <Text style={{ color: '#666', marginRight: 4 }}>{`${item.averagePrice}`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>);

    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', }}>{'系列覆盖率：'}</Text>
                    <Text style={{ color: '#333', }}>{`${this.state.seriesCovering}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#333' }}>{'产品覆盖率：'}</Text>
                    <Text style={{ color: '#333', }}>{`${this.state.productsCovering}`}</Text>
                    </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#f80000', }}>{`总销售额:`}</Text>
                <Text style={{ color: '#f80000', }}>{`${this.state.totalSum}`}</Text>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f2f2f2' }}></View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderRow} />
        </View>;
    }
}
export default S_SeriesDetailPage;
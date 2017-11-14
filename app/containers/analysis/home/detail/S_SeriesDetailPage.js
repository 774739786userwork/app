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
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        let param = params.param;
        if (param.year) {
            param.currTime = param.year;
        }
        if (param.month) {
            param.currTime = param.month;
        }
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getSalesSeriesDetails.page', param, 30 * 60).then((responseData) => {
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
        const { navigation } = this.props;
        let param = navigation.state.params.param
        param.seriesId = item.seriesId;
        param.seriesName = item.seriesName;
        navigation.navigate('PriceDetailPage',{param});
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
    _renderRow(rowData, sectionID, rowID) {
        return (<View key={`row_${rowID}`} style={{ borderColor: '#e9e9e9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
            <View>
                <View style={{ height: 34, backgroundColor: '#f9f9f9', paddingLeft: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={this._rowSalesPress.bind(this, rowData)}>
                        <Text style={{ color: '#333' }}>{`${rowData.seriesName} ${rowData.seriesTotalSum ? rowData.seriesTotalSum : 0}万元 占比${rowData.seriesPrecent ? rowData.seriesPrecent : 0}`}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingLeft: 10, paddingBottom: 8, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <View style={{ backgroundColor: this.getColor(rowID), justifyContent: 'center', padding: 2, width: 60, height: 60, borderRadius: 30 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', margin: 2, }}>{`${rowData.seriesName}`}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._rowOnPress.bind(this, rowData)}>
                        <View style={{ flex: 1, paddingLeft: 12 }}>
                            <Text style={{ color: '#999', }}>{`最高价${rowData.highestPrice ? rowData.highestPrice : 0}元占比${rowData.highestPricePrecent ? rowData.highestPricePrecent : 0}`}</Text>
                            <Text style={{ color: '#999', marginTop: 4 }}>{`最低价${rowData.lowestPrice ? rowData.lowestPrice : 0}元占比${rowData.lowestPricePrecent ? rowData.lowestPricePrecent : 0}`}</Text>
                            <Text style={{ color: '#999', marginTop: 4 }}>{`平均价${rowData.averagePrice ? rowData.averagePrice : 0}元`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>);

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
export default S_SeriesDetailPage;
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
import LoadingListView from '../../../components/LoadingListView'
import ImageView from '../../../components/ImageView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//销售组  销售情况
class EmployeeSaleDetailPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: ` ${navigation.state.params.groupName}销售情况`,
    });

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderGroup = this._renderGroup.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getSimpleEmployeeSaleDetail.page', params, 30 * 60).then((responseData) => {
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
    _rowOnPress(employeeId,item) {
        //seriesName
        const { navigation } = this.props;
        let param = navigation.state.params;
        param.employeeId = employeeId;
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
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />
                
                <View style={{ padding: 8, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.employeeName}</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        onPress={this._onCustomerSaleDetailPress.bind(this, item)}
                    >
                    <Text style={{ color: '#FF33FF', marginRight: 4, }}>{`客户情况`}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 30, backgroundColor: '#fff', paddingLeft: 20, paddingBottom: 4, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#f80000', fontSize: 14 }}>{`销售总额：${item.totalSum}元`}</Text>
                </View>
                {
                    item.seriesList.map((item, index) => {
                        return this._renderRow(employeeId,item, index)
                    })
                }
            </View>
        );
    }
    _renderRow(employeeId,item, index) {
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, employeeId,item)}
                key={`row_${index}`}
            >
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
            <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13}}>{`${item.seriesName}：`}</Text>
                        <Text style={{ color: '#999', fontSize: 13}}>{`${item.seriesSalerSum}元`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13}}>{`销量：${item.seriesSales}`}</Text>
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
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default EmployeeSaleDetailPage;
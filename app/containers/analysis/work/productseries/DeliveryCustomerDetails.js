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
//送货客户明细
class DeliveryCustomerDetails extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `送货客户明细`,
    });
    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            totalSalerSum: '',
            totalSalerQuantity:'',
            totalGiftQuantity:'',
            cusList:[],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getDeliveryCustomerDetails.page', params, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let cusList = [];
                    let totalSalerSum =  '';
                    let totalSalerQuantity  = '';
                    let totalGiftQuantity = '';
                    if(data){
                        cusList = data.cusList;
                        totalSalerSum  = data.totalSalerSum ? data.totalSalerSum : 0; 
                        totalSalerQuantity  = data.totalSalerQuantity ? data.totalSalerQuantity : 0;
                        totalGiftQuantity = data.totalGiftQuantity ? data.totalGiftQuantity : 0;
                    }
                    this.setState({ cusList,totalSalerSum,totalSalerQuantity,totalGiftQuantity, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    _renderRow(item, sectionID, rowID) {
        return (<View key={`row_${rowID}`} style={{ borderColor: '#e9e9e9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
            <View style={{ height: 34, paddingLeft: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#333' }}>{`${item.salerDate}`}</Text>
            </View>
            <View style={{ height: 30,paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#333' }}>{`${item.customerName}`}</Text>
                <Text style={{ color: '#333',marginLeft:12 }}>{`${item.customerPhone}`}</Text>
            </View>
            <View style={{ paddingLeft: 10, paddingBottom: 8, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'单价:'}</Text>
                            <Text style={{ color: '#666', }}>{`${item.price}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'销量：'}</Text>
                            <Text style={{ color: '#666', marginRight: 4 }}>{`${item.salerQuantity}`}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'销售额：'}</Text>
                            <Text style={{ color: '#666', }}>{`${item.salerSum}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'赠送：'}</Text>
                            <Text style={{ color: '#666', marginRight: 4 }}>{`${item.giftQuantity}`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>);

    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 26, backgroundColor: '#f8f9fa', paddingLeft: 12, paddingTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', }}>{'总销量：'}</Text>
                    <Text style={{ color: '#333', }}>{`${this.state.totalSalerQuantity}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#333' }}>{'总赠送：'}</Text>
                    <Text style={{ color: '#333', }}>{`${this.state.totalGiftQuantity}`}</Text>
                </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#333', }}>{`总销售额:`}</Text>
                <Text style={{ color: '#333', }}>{`${this.state.totalSalerSum}元`}</Text>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f2f2f2' }}></View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.cusList ? this.state.cusList : [])}
                renderRowView={this._renderRow} />
        </View>;
    }
}
export default DeliveryCustomerDetails;
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
//交易客户明细
class ProductDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let custype = state.params.custype;
        let title = "";
        if(custype === 0){
           title = "交易客户明细"
        }else if(custype === 1){
            title = "新增交易客户明细"
        }else{
            title = "新增并返单客户明细"
        }
        return {
            headerTitleStyle: {fontSize: 16},
            title: title
        };
    };
    constructor(props) {
        super(props)
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
            FetchManger.getUri('dataCenter/appHomePage/getSingleProductDetails.page', params, 30 * 60).then((responseData) => {
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
    _renderGroup(item, sectionID, index) {
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ padding: 8, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.customerName}</Text>
                    <Text style={{ color: '#333', fontSize: 12, marginRight: 4, }}>{`${item.customerPhone}`}</Text>
                </View>
                {
                    item.empList.map((item, index) => {
                        return this._renderRow(item, index)
                    })
                }
            </View>
        );
    }
    _renderRow(item, index) {
        return (
            <TouchableOpacity
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                    <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#333', fontSize: 16 }}>{`${item.salerDate}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#333', fontSize: 16 }}>{`${item.empName}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'单价：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.price}元`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销量：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.salerQuantity}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'赠送：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.giftQuantity}元`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销售额：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.salerSum}元`}</Text>
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
        const { params } = this.props.navigation.state;
        let title = params.startDate + "~" +params.endDate + params.orgName
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 42, backgroundColor: '#f9f9f9', paddingLeft: 12, flexDirection: 'column'}}>
                <Text style={{ color: '#FF33FF',fontSize: 16 }}>{title}</Text>
                <Text style={{ color: '#FF33FF',fontSize: 16 }}>{`${params.productName}`}</Text>
            </View>    
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f2f2f2' }}></View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default ProductDetailPage;
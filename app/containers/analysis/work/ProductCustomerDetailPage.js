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

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//业务员产品客户详情
class ProductCustomerDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `业务员产品客户详情`,
    });
    constructor(props) {
        super(props)
        this._renderGroup = this._renderGroup.bind(this);
        this.state = {
            data: {},
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        let param = {};
        param.currTime = params.currTime;
        param.orgId = params.orgId;;
        param.type = params.type;;
        param.empId = params.empId;
        param.productId = params.productId;
        param.userId = params.userId;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getProductEmployeeDetail.page', param, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({data,
                        loading: false
                    })
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
            <View key={`row_${index}`} style={{ backgroundColor: '#ffff' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#f2f2f2' }} />
                <View style={{ padding: 8, flexDirection: 'row'  }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.customerName}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', marginRight: 4, }}>{item.customerPhone}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`销量:`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.totalSum}`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`时间:`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.deliveryDate}`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`金额:`}</Text>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.salesQuantity}元`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.customerAddress}元`}</Text>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        const { empName,productName,customerCount } = this.state.data;
        const { currTime } = this.props.navigation.state.params;
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#999', }}>{'业务员：'}</Text>
                    <Text style={{ color: '#999', }}>{`${empName ? empName : ''}`}</Text>
                </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#999' }}>{'产品：'}</Text>
                    <Text style={{ color: '#999', marginRight: 4 }}>{`${productName?productName:''}`}</Text>
                </View>
            </View>
            <View style={{ height: 24, backgroundColor: '#f8f9fa', paddingLeft: 12, marginTop: 10,marginBottom:12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#999', }}>{'客户数:'}</Text>
                    <Text style={{ color: '#999', }}>{`${customerCount ? customerCount : ''}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#999' }}>{'时间:'}</Text>
                    <Text style={{ color: '#999', marginRight: 4 }}>{`${currTime}`}</Text>
                </View>
            </View>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.data.cusList ? this.state.data.cusList : [])}
                renderRowView={this._renderGroup} />
        </View>;
    }
}

export default ProductCustomerDetailPage;
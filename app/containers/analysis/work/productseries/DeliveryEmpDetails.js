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
//送货业务员明细
class DeliveryEmpDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle: {fontSize: 16},
            title: `业务员送货明细`,
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
            FetchManger.getUri('dataCenter/appHomePage/getDeliveryEmpDetails.page', params, 30 * 60).then((responseData) => {
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
    onItemPress(item) {
        const { navigation } = this.props;
        const { params } = navigation.state;
        params.empId = item.empId;
        params.empName = item.empName;
        navigation.navigate('DeliveryCustomerDetails', params);
    }
    _renderGroup(item, sectionID, index) {
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ padding: 8, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.groupName}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4, }}>{`销量:${item.groupQuantity}`}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4, }}>{`销售额:${item.groupSum}元`}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4, }}>{`客户数:${item.groupCustomerCount}`}</Text>
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
                onPress={this.onItemPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                    <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{`${item.empName}`}</Text>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销量：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.empQuantity}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销售额：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.empSum}元`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'客户数：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.empCustomerCount}`}</Text>
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
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default DeliveryEmpDetails;
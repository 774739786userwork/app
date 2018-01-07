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
//业务员带货明细
class TakeGoodsEmpDetails extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `业务员带货明细`,
    });
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
            FetchManger.getUri('dataCenter/appHomePage/getTakeGoodsEmpDetails.page', params, 30 * 60).then((responseData) => {
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
                    <Text style={{ color: '#333', flex: 1 }}>{item.groupName}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4, }}>{`带货:${item.groupTakeGoods}`}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4, }}>{`销量:${item.groupQuantity}`}</Text>
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
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'带货：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.empTakeGoods}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'销量：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.empQuantity}`}</Text>
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
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default TakeGoodsEmpDetails;
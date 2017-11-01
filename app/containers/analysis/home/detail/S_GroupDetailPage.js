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
//销售总额明细 销售组
class S_GroupDetailPage extends React.Component {

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderGroup = this._renderGroup.bind(this);
        this._OnGropPress = this._OnGropPress.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        let param = params.param;
        if(param.year){
            param.currTime = param.year;
        }
        if(param.month){
            param.currTime = param.month;
        }
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearOrganizeTotalDetail.page', param, 30 * 60).then((responseData) => {
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
    _OnGropPress(item) {
        const { navigation } = this.props;
        let param = navigation.state.params.param;
        param.groupId = item.groupId;
        navigation.navigate('S_Person4GroupDetailPage', { param })
    }

    _renderGroup(item, sectionID, index) {
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />
                <TouchableOpacity
                    onPress={this._OnGropPress.bind(this, item)}
                >
                    <View style={{ padding: 8, flexDirection: 'row' }}>
                        <Text style={{ color: '#333', flex: 1 }}>{item.groupName}</Text>
                        <Text style={{ color: '#f80000', fontSize: 12, marginRight: 4, }}>{`销售:${item.groupTotalSum}元`}</Text>
                    </View>
                </TouchableOpacity>
                {
                    item.productList.map((item, index) => {
                        return this._renderRow(item, index)
                    })
                }
            </View>
        );
    }
    _renderRow(item, index) {
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
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
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.productSales}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'平均价：'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12, marginRight: 4 }}>{`${item.productAveragePrice}`}</Text>
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
export default S_GroupDetailPage;
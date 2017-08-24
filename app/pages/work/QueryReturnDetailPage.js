import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableHighlight,
    InteractionManager,
    FlatList
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo, FetchManger } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import ImageView from '../../components/ImageView'

var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class QueryReturnDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.queryReturnDetail = this.queryReturnDetail.bind(this);
        this.state = {
            queryReturnDetail: {},
            loading: false,
            listData: [],
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        InteractionManager.runAfterInteractions(() => {
            this.queryReturnDetail(params.returnId,params.returnType);
        });
    }

    queryReturnDetail(returnId, returnType) {
        const token = LoginInfo.getUserInfo().token;
        let reqParams = { token, returnId, returnType };
        this.setState({ loading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/returnmanage/getReturnProductList.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ listData: data ? data : [], loading: false });
                } else {
                    this.setState({ loading: false });
                    Toast.show(responseData.msg);
                }
            }).catch((error) => {
                console.log(error)
                this.setState({ loading: false });
                Toast.show("网络错误");
            })
        });

    }

    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                        <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.productImage }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.productName}`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'退货数量:'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.returnQuantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'实际价：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.product_sum}元`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'入库数：'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.instockQuantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总金额：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.product_sum}元`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }
    _onItemPress() {

    }


    render() {
        const { params } = this.props.navigation.state;
        const { listData } = this.state;
        let count = 0;
        let sum = 0.0;
        let foregift = 0.0;

        listData.forEach((e) => {
            sum += parseFloat(e.product_sum);
            foregift += parseFloat(e.product_foregift);
        });
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', padding: 12 }}>
                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contactName}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.customerMobile}`}</Text>
                    </View>
                    <View style={{ height: 30, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>{`${params.customerAddress}`}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        this.state.loading ?
                            <LoadingView /> :
                            (this.state.listData.length == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 暂无数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={dataSource.cloneWithRows([this.state.listData])}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                </View>
                <View style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff9f9', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{`总退${count}件商品,共计金额￥${sum}`}</Text>
                </View>
                <View style={{ height: 58, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12 }} />
                    <View style={{ flex: 1, alignItems: 'center', height: 40 }} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{`抹零金额:`}</Text>
                            <Text style={{ width: 80 }}>{`0.9`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{`实退金额:`}</Text>
                            <Text style={{ width: 80 }}>{`66834234`}</Text>
                        </View>
                    </View>
                    <View style={{ width: 12 }} />
                    <TouchableHighlight style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onItemPress.bind(this)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#17c6c1', borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                            <Iconfont
                                icon={'e6bd'} // 图标
                                iconColor={'#fff'}
                                iconSize={22}
                                label={'重新打印'}
                                labelColor={'#fff'}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={{ width: 12 }} />
                </View>
            </View >
        );
    }
}

export default QueryReturnDetailPage;

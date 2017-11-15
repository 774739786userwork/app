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
import { NavigationActions } from 'react-navigation'

var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class QueryReturnDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.queryReturnDetail = this.queryReturnDetail.bind(this);
        this.state = {
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
                    let list = this.state.listData.concat(data);
                    this.setState({ listData: list, loading: false });
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
                        <View style={{ height: 34, paddingLeft: 12, marginBottom: 5, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.productName}`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'退货数量:'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.returnQuantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'实际价：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.realPrice}元`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'入库数：'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.instockQuantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总金额：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.productSum}元`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }
    _onItemPress() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;
        const { listData } = this.state;
        let count = 0;
        
        listData.forEach((e) => {
            count += parseFloat(e.returnQuantity);
        });
        let bleParams = { title: '退货单', name: '仓管签字' };//打印信息
        bleParams.headerList = [
          { text: `退货时间:${DateUtils.show()}` },
          { text: `退货流水号:${params.serialNumber}`},
          { text: `店名:${params.customerName}` },
          { text: `地址:${params.customerAddress}` },
          { text: `联系人:${params.contactName}` },
          { text: `电话:${params.customerMobile}` },
          { text: `退货人:${LoginInfo.getUserInfo().user_real_name}` },
          { text: `联系方式:${LoginInfo.getUserInfo().mobile_number}` },
          { text: `车牌号:${params.carNumber}` },
          { text: `退货原因:${params.returnReason}` }];

        bleParams.detailList = [];
          
        this.state.listData.map((_Item) => {
            let total =  _Item.productSum;
            let printItem = [{ title: true, text: `${_Item.productName}` }, { text: `退货数:${_Item.returnQuantity}`, text1: `￥${total}` }];
            bleParams.detailList.push(printItem);
        })
        bleParams.footerList = [{ text: `数量总计:${count}`, text1: `应退金额:${params.totalSum}` }, { text: `实退金额:${params.realReturnSum}`, text1: `抹零金额:${params.smallChangeSum}` }];
        const navigationAction = NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'Home' }),
              NavigationActions.navigate({ routeName: 'BleManager', params: bleParams })
            ]
          })
          navigation.dispatch(navigationAction)
    }


    render() {
        const { params } = this.props.navigation.state;
        const { listData } = this.state;
        let count = 0;

        listData.forEach((e) => {
            count += parseFloat(e.returnQuantity);
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
                                    dataSource={dataSource.cloneWithRows(this.state.listData)}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                </View>
                <View style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff9f9', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{`共退${count}件商品,共计金额￥${params.totalSum}`}</Text>
                </View>
                <View style={{ height: 58, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12 }} />
                    <View style={{ flex: 1, alignItems: 'center', height: 40 }} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{`抹零金额:`}</Text>
                            <Text style={{ width: 80 }}>{`￥${params.smallChangeSum}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{`实退金额:`}</Text>
                            <Text style={{ width: 80 }}>{`￥${params.realReturnSum}`}</Text>
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

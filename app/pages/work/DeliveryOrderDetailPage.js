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
import AbortEditeModel from './AbortEditeModel'
import Spinner from 'react-native-loading-spinner-overlay';
const WINDOW_WIDTH = Dimensions.get('window').width;
// let coords = {}
class DeliveryOrderDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.state = {
            modalVisible: false,
            showSpinner: false
        }
    }
    componentWillReceiveProps(nextProps) {
        const { deliveryOrderDetail } = nextProps;
        if (deliveryOrderDetail.errMsg) {
            Toast.show(deliveryOrderDetail.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        InteractionManager.runAfterInteractions(() => {
            action.deliveryOrderDetail(params.delivery_id);
        });
        // navigator.geolocation.getCurrentPosition(
        //     (initialPosition) => {
        //         coords = initialPosition.coords;
        //     },
        //     (error) => {
        //     }
        // );
    }
    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70 }}>
                        <ImageView style={{ width: 60, height: 60, borderWidth: 1, borderColor: '#c4c4c4' }} source={{ uri: item.image }} />
                    </View>
                    <View style={{ flex: 1,marginTop:2 }}>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        </View>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666' }}>{'售价：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.price}`}</Text>
                            <Text style={{ color: '#666' }}>{'x'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.sale_quantity}`}</Text>
                        </View>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'赠送：'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.gifts_quantity}`}</Text>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总计金额：'}</Text>
                                <Text style={{ color: '#f80000',marginLeft:8 }}>￥{`${item.product_sum}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }
    //0  作废本单
    //1  重开 送货单
    //2  重新打印

    _onItemPress(index) {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;
        if (index === 0) {
            this.setState({ modalVisible: true })
        } else if (index === 1) {
            let custParam = {}
            custParam.address = params.customer_address;
            custParam.contacts = [{ name: params.contact_name, mobile1: params.contact_mobile }]
            custParam.customersName = params.customer_name
            custParam.customersId = params.customer_id
            // custParam.lat = coords.latitude
            // custParam.lng = coords.longitude

            const navigationAction = NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    NavigationActions.navigate({ routeName: 'AddDeliveryOrder', params: custParam }),
                ]
            })
            navigation.dispatch(navigationAction)
        } else {
            const { deliveryOrderDetail } = this.props;
            let sum = 0
            if (deliveryOrderDetail.result && deliveryOrderDetail.result.productLists) {
                deliveryOrderDetail.result.productLists.map((item) => {
                    sum += item.sale_quantity + item.gifts_quantity
                })
            }
            
            const { result } = deliveryOrderDetail;
            result.print = true
            result.num = sum
            navigation.navigate('BleManager', { ...params, ...result })
        }
    }
    onConfirmPress(content) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        this.setState({ modalVisible: false, showSpinner: true })
        const token = LoginInfo.getUserInfo().token;
        let saveParams = {}
        saveParams.delivery_id = params.delivery_id
        saveParams.value_date = content
        saveParams.token = token
        FetchManger.postUri('/mobileServiceManager/deliveryNotes/toAbortInfo.page', saveParams).then((responseData) => {
            if (responseData.status === '0' || responseData.status === 0) {
                const navigationAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                    ]
                })
                navigation.dispatch(navigationAction)
                Toast.show('作废成功')
                this.setState({ showSpinner: false })
            } else {
                Toast.show(responseData.msg)
                this.setState({ showSpinner: false })
            }
        }).catch((error) => {
            console.log(error)
            this.setState({ showSpinner: false })
            Toast.show('作废失败')
        })
    }

    onCancelPress() {
        this.setState({ modalVisible: false })
    }


    render() {
        const { params } = this.props.navigation.state;
        const { deliveryOrderDetail } = this.props;
        let sum = 0
        if (deliveryOrderDetail.result && deliveryOrderDetail.result.productLists) {
            deliveryOrderDetail.result.productLists.map((item) => {
                sum += item.sale_quantity + item.gifts_quantity
            })
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7'}}>
                    <View style={{ height: 25, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16,marginLeft:5 }}>{`${params.contact_name}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16,marginLeft:10 }}>{`${params.contact_mobile}`}</Text>
                    </View>
                    <View style={{ height: 25, marginTop: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff',marginLeft:5 }}>{`${params.customer_address}`}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        deliveryOrderDetail.loading ?
                            <LoadingView /> :
                            (deliveryOrderDetail.listData._cachedRowCount == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 暂无数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={deliveryOrderDetail.listData}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                    
                </View>
                {
                    !deliveryOrderDetail.loading && deliveryOrderDetail.listData._cachedRowCount > 0 ?
                        <View style={{ height: 100, backgroundColor: '#fff', flexDirection: 'column', alignItems: 'center' }}>
                            <View style={{ padding: 5, backgroundColor: '#fff9f9',width:WINDOW_WIDTH }}>
                                <View style={{ flexDirection:'row'}}>
                                    <Text style={{ color: '#666' }}>{`总共${sum}件商品,`}</Text>
                                    <Text style={{ color: '#f80000' }}>{`共计￥${params.total_sum},`}</Text>
                                    <Text style={{ color: '#666' }}>{`其中押金￥${params.foregift_sum ? params.foregift_sum : 0.00}`}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                    <Text style={{ color: '#666' }}>{`铺货总计/优惠总计/未收总计:`}</Text>
                                    <Text style={{ color: '#f80000' }}>{`￥${params.distribution_sum}/￥${params.discount_sum}/￥${params.unpaid_total_sum}`}</Text>
                                </View>
                            </View>
                            <View style={{height: 50, backgroundColor: '#fff', flexDirection:'row', alignItems: 'center' }}>
                                <View style={{ width: 12 }} />
                                <TouchableHighlight style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onItemPress.bind(this, 0)}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#17c6c1', borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                                        <Iconfont
                                            icon={'e6c4'} // 图标
                                            iconColor={'#fff'}
                                            iconSize={22}
                                            label={'作废本单'}
                                            labelColor={'#fff'}
                                        />
                                    </View>
                                </TouchableHighlight>
                                <View style={{ width: 12 }} />
                                <TouchableHighlight style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onItemPress.bind(this, 2)}>
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
                        </View>
                        : null
                }
                <AbortEditeModel content={this.state.abortInfo} modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} onConfirmPress={this.onConfirmPress} />
                <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default DeliveryOrderDetailPage;

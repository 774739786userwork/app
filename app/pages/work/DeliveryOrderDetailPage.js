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
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
const ic_product = require('../../imgs/ic_product.png')

class DeliveryOrderDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
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
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                        <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                    </View>
                    <View>
                        <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666' }}>{'售价：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.price}`}</Text>
                            <Text style={{ color: '#666' }}>{'x'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.sale_quantity}`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'赠送：'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.gifts_quantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总计金额：'}</Text>
                                <Text style={{ color: '#f80000' }}>{'￥'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.product_sum}`}</Text>
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
        const { deliveryOrderDetail } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', padding: 12 }}>
                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contact_name}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contact_mobile}`}</Text>
                    </View>
                    <View style={{ height: 30, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>{`${params.customer_address}`}</Text>
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
                                    renderFooter={() =>
                                        <View style={{padding: 12, backgroundColor: '#fff9f9' }}>
                                            <Text style={{ color: '#666' }}>{`总共${deliveryOrderDetail.result.total_sum}件商品,共计￥${deliveryOrderDetail.result.total_sum},其中押金￥${deliveryOrderDetail.result.total_foregift}`}</Text>
                                            <View style={{ flexDirection: 'row',marginTop:6 }}>
                                                <Text style={{ color: '#666' }}>{`铺货总计/优惠总计/未收总计:`}</Text>
                                                <Text style={{ color: '#f80000' }}>{`￥${deliveryOrderDetail.result.total_discount_sum}/￥${deliveryOrderDetail.result.total_discount_sum}/￥${deliveryOrderDetail.result.unpaid_total_sum}`}</Text>
                                            </View>
                                        </View>
                                    }
                                />
                            )

                    }
                </View>
                {
                    !deliveryOrderDetail.loading && deliveryOrderDetail.listData._cachedRowCount > 0 ?
                        <View style={{ height: 58, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 12 }} />
                            <TouchableHighlight style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onItemPress.bind(this)}>
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
                            <TouchableHighlight style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onItemPress.bind(this)}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#17c6c1', borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                                    <Iconfont
                                        icon={'e6c5'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={22}
                                        label={'重新送货'}
                                        labelColor={'#fff'}
                                    />
                                </View>
                            </TouchableHighlight>
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
                        : null
                }

            </View >
        );
    }
}

export default DeliveryOrderDetailPage;

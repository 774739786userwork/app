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
} from 'react-native';
import { Iconfont, LoadingView,Toast } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
const ic_peisong = require('../../imgs/ic_paisong.png');

class PurchaseOrderDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
    }
     componentWillReceiveProps(nextProps) {
        const { purchaseOrderDetail } = nextProps;
        if (purchaseOrderDetail.errMsg) {
            Toast.show(purchaseOrderDetail.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.purchaseOrderDetail();
        });
    }
    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 34, backgroundColor: '#f9f9f9' }}>
                    <View style={{ marginRight: 4 }}>
                        <Iconfont fontFamily={'OAIndexIcon'}
                            icon='e6bf'
                            iconColor='#118cd7'
                            iconSize={16}
                        />
                    </View>
                    <Text style={{ color: '#118cd7' }}>{item.purchase_date}</Text>
                </View>
                <View style={{ height: 34, paddingLeft: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#666', }}>订单编号：</Text>
                    <Text style={{ color: '#666', }}>{item.serial_number}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 2, color: '#333', textAlign: 'left', fontSize: 16 }}>{item.customer_name}</Text>
                    <Text style={{ flex: 1, color: '#999', textAlign: 'right' }}>{item.customer_phone}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#999' }}>{item.goodsStr}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#999' }}>{item.customer_address}</Text>
                </View>
                <Image source={ic_peisong} style={{ justifyContent: 'center',paddingBottom:8, alignItems: 'center', position: 'absolute', width: 24, height: 54, top: 0, right: 14, }}>
                    <Text style={{ fontSize: 12, color: '#fff', backgroundColor: '#fe6732' }}>{this.charatState(item.purchase_status)}</Text>
                </Image>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>);
    }
    charatState(state) {
        let target = new String();
        let lenght = state.length;
        for (i = 0; i < lenght; i++) {
            target = target.concat(state.charAt(i))
            if (i != lenght - 1)
                target = target.concat('\n');
        }
        return target;
    }

    //加载更多
    onEndReached() {
        const { action, purchaseOrderDetail } = this.props;
        const start = purchaseOrderDetail.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.purchaseOrderDetail(start);
            }
        });
    }
    render() {
        const { purchaseOrderDetail } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <LoadingListView
                    loading={purchaseOrderDetail.loading}
                    loadMore={purchaseOrderDetail.loadMore}
                    listData={purchaseOrderDetail.listData}
                    renderRowView={this._renderItem}
                    onEndReached={this.onEndReached} />
            </View >
        );
    }
}

export default PurchaseOrderDetailPage;

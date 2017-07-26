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
import { Iconfont,Toast } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'


class PurchaseOrderInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { purchaseOrderInfo } = nextProps;
        if (purchaseOrderInfo.errMsg) {
            Toast.show(purchaseOrderInfo.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            // action.purchaseOrderInfo();
        });
    }
    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, color: '#999', fontSize: 16 }}>{item.product_name}</Text>
                    <Text style={{ flex: 1, color: '#999', fontSize: 16 }}>{item.product_quantity + '桶'}</Text>
                </View>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, color: '#f80000', fontSize: 16 }}>{item.product_price + '元'}</Text>
                    <Text style={{ flex: 1, color: '#f80000', fontSize: 16 }}>{'￥' + item.product_sum}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>);
    }
    //加载更多
    onEndReached() {
        const { action, purchaseOrderInfo } = this.props;
        const start = purchaseOrderInfo.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.purchaseOrderInfo(start);
            }
        });
    }
    render() {
        const { purchaseOrderInfo } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <LoadingListView
                    loading={purchaseOrderInfo.loading}
                    loadMore={purchaseOrderInfo.loadMore}
                    listData={purchaseOrderInfo.listData}
                    renderRowView={this._renderItem}
                    onEndReached={this.onEndReached} />
            </View >
        );
    }
}

export default PurchaseOrderInfoPage;

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
import { Iconfont } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'


class PurchaseOrderDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
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
                    <Text style={{ color: '#118cd7' }}>{item.loadingdate}</Text>
                </View>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>提货单编号：</Text>
                    <Text style={{ color: '#333', fontSize: 16 }}>{item.serial_number}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{item.goodsStr}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000' }}>{'车次：'}</Text>
                        <Text style={{ color: '#f80000' }}>{'第' + item.loadingcount + '车'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000' }}>{'开单人：'}</Text>
                        <Text style={{ color: '#f80000' }}>{item.create_user_name}</Text>
                    </View>
                </View>
            </View>);
    }
    _separator = () => {
        return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />;
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

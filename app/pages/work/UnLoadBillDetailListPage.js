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
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
const ic_peisong = require('../../imgs/ic_paisong.png');
import { NavigationActions } from 'react-navigation'

class UnLoadBillDetailListPage extends React.Component {
    constructor(props) {
        super(props);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this._onClickBluth = this._onClickBluth.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { unLoadBillDetailList } = nextProps;
        if (unLoadBillDetailList.errMsg) {
            Toast.show(unLoadBillDetailList.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.unLoadBillDetailList();
        });
    }

    //重新打印卸货
    _onClickBluth(rowData){
        let params = { CXXH:true }
        const { navigation} = this.props;
        params.data = rowData;
        const navigationAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
                NavigationActions.navigate({ routeName: 'BleManager', params: params })
            ]
        })
        navigation.dispatch(navigationAction)
    }
    _renderItem = (item, index) => {
        return (
            <TouchableHighlight onPress={this._onClickBluth.bind(this,item)}
                key={`row_${index}`}>
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 34, backgroundColor: '#f9f9f9' }}>
                        <View style={{ marginRight: 4 }}>
                            <Iconfont fontFamily={'OAIndexIcon'}
                                icon='e6bf'
                                iconColor='#118cd7'
                                iconSize={16}
                            />
                        </View>
                        <Text style={{ color: '#118cd7' }}>{item.unLoad_date}</Text>
                    </View>
                    <View style={{ height: 8 }} />
                    {
                        item.goodsList.map((goodsItem) => (
                            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333' }}>{goodsItem.product_name}</Text>
                                <Text style={{ color: '#333' }}>{'   '}</Text>
                                <Text style={{ color: '#333' }}>{goodsItem.disburden_quantity}</Text>
                                <View style={{ width: 8 }} />
                                <Text style={{ color: '#333' }}>{goodsItem.product_specifications}</Text>
                            </View>))
                    }
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#333' }}>{'卸货人：'}</Text>
                            <Text style={{ color: '#333' }}>{item.unLoad_person}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#333' }}>{'车牌：'}</Text>
                            <Text style={{ color: '#333' }}>{item.platenumber}</Text>
                        </View>
                    </View>
                    <Image source={ic_peisong} style={{ justifyContent: 'center', paddingBottom: 8, alignItems: 'center', position: 'absolute', width: 24, height: 54, top: 0, right: 14, }}>
                        <Text style={{ fontSize: 12, color: '#fff', backgroundColor: '#fe6732' }}>{this.charatState(item.unLoad_status)}</Text>
                    </Image>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    charatState(state) {
        let str = state.indexOf('未') > 0 ? '未入库' : '已入库'
        let target = new String();
        let lenght = str.length;
        for (i = 0; i < lenght; i++) {
            target = target.concat(str.charAt(i))
            if (i != lenght - 1)
                target = target.concat('\n');
        }
        return target;
    }

    //加载更多
    onEndReached() {
        const { action, unLoadBillDetailList } = this.props;
        const start = unLoadBillDetailList.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.unLoadBillDetailList(start);
            }
        });
    }
    render() {
        const { unLoadBillDetailList } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <LoadingListView
                    loading={unLoadBillDetailList.loading}
                    loadMore={unLoadBillDetailList.loadMore}
                    listData={unLoadBillDetailList.listData}
                    renderRowView={this._renderItem}
                    onEndReached={this.onEndReached} />
            </View >
        );
    }
}

export default UnLoadBillDetailListPage;

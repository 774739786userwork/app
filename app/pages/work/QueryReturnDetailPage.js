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
import { Iconfont, LoadingView,Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
const ic_product = require('../../imgs/ic_product.png')

class QueryReturnDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { queryReturnDetail } = nextProps;
        if (queryReturnDetail.errMsg) {
            Toast.show(queryReturnDetail.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;

        InteractionManager.runAfterInteractions(() => {
            action.queryReturnDetail(params.saler_id);
        });
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                        <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                    </View>
                    <View style={{flex:1}}>
                        <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666' }}>{'退货数量:'}</Text>
                            <Text style={{ color: '#666' }}>{`100`}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'单价：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.price}元`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总价：'}</Text>
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
        const { queryReturnDetail } = this.props;
        let count = 0;
        let sum = 0.0;
        let foregift = 0.0;
        if (queryReturnDetail.result) {
            count = queryReturnDetail.result.length;
            queryReturnDetail.result.forEach((e) => {
                sum += parseFloat(e.product_sum);
                foregift += parseFloat(e.product_foregift);
            });
        }

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ flex: 1 }}>
                    {
                        queryReturnDetail.loading ?
                            <LoadingView /> :
                            (queryReturnDetail.listData._cachedRowCount == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 暂无数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={queryReturnDetail.listData}
                                    renderRow={this._renderItem}
                                    renderFooter={() =>
                                        <View style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff9f9', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: '#666' }}>{`总共${count}件商品,共计￥${sum},其中押金￥${foregift}。`}</Text>
                                        </View>
                                    }
                                />
                            )

                    }
                </View>
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

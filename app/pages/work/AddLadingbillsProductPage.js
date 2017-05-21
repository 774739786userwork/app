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
import { Iconfont, LoadingView } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
const ic_product = require('../../imgs/ic_product.png')
const WINDOW_WIDTH = Dimensions.get('window').width;

class AddLadingbillsProductPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.addLadingbillsProduct();
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
                                <Text style={{ color: '#f80000' }}>{`${item.sum}`}</Text>
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
        const { addLadingbillsProduct } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', padding: 12 }}>
                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.car_id[0]}`}</Text>
                    </View>
                    <View style={{ height: 30, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.storehouse_id[0]}`}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        addLadingbillsProduct.loading ?
                            <LoadingView /> :
                            (addLadingbillsProduct.listData._cachedRowCount == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 暂无数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={addLadingbillsProduct.listData}
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
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View>
                            <Iconfont
                                icon={'e66e'} // 图标
                                iconColor={'#999'}
                                iconSize={22}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999' }}>{'总数量：'}</Text>
                            <Text style={{ color: '#f80000' }}>{'100'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999' }}>{'总质量：'}</Text>
                            <Text style={{ color: '#f80000' }}>{'100'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{'保存'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View >
        );
    }
}

export default AddLadingbillsProductPage;

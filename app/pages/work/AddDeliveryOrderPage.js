import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Modal,
    TouchableHighlight
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
const ic_product = require('../../imgs/ic_product.png')

import AddDeliveryEditeModel from './AddDeliveryEditeModel'
import AddDeliveryPopModel from './AddDeliveryPopModel'
const WINDOW_WIDTH = Dimensions.get('window').width;

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class AddDeliveryOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this._onItemPress = this._onItemPress.bind(this)
        this.state = {
            modalVisible: false,
            modalPopVisible: false,
            selectItem: {},
            chooseList: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { addDeliveryOrder } = nextProps;
        if (addDeliveryOrder.errMsg) {
            Toast.show(addDeliveryOrder.errMsg);
            return;
        }
        const { action, navigation } = this.props;
        const { params } = navigation.state;
        if (addDeliveryOrder.selectCar && !addDeliveryOrder.loading && addDeliveryOrder.result.length == 0) {
            action.addDeliveryOrder(addDeliveryOrder.selectCar.carbaseinfo_id)
        }
    }
    componentDidMount() {
        const { action, navigation } = this.props;
        const { params } = navigation.state;
        InteractionManager.runAfterInteractions(() => {
            action.getCar4Delivery();
        });
    }
    _rowOnPress(selectItem) {
        this.setState({ modalVisible: true, selectItem });
    }

    _renderItem = (item, index) => {
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{item.name}</Text>
                                <View style={{ flex: 1 }} />
                                <Text style={{ color: '#666', marginRight: 8, fontSize: 12 }}>{item.specifications ? item.specifications : ''}</Text>
                            </View>
                            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{item.activity ? item.activity : ''}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'库存：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${item.stock}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'单价：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${item.price}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'数量：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${item.sequence}`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>)
    }
    _onItemPress() {
        this.setState({ modalPopVisible: true });
    }

    onConfirmPress(newItem) {
        let oldItem = null;
        let chooseList = this.state.chooseList
        if (newItem.sale_quantity != 0 || newItem.gifts_quantity != 0) {

            chooseList.map((item) => {
                if (item.id === newItem.id) {
                    oldItem = item;
                }
            })
            if (oldItem) {
                //产品销售量
                oldItem.sale_quantity = newItem.sale_quantity
                //产品赠送量
                oldItem.gifts_quantity = newItem.gifts_quantity
                //产品小计金额
                oldItem.product_sum = newItem.product_sum
                //产品出售时单价
                oldItem.price = newItem.price
                //产品序列
                oldItem.sequence = newItem.sequence
                //产品简称
                oldItem.product_name = newItem.product_name
                //送货的记量人
                oldItem.delivery_remember_person = newItem.delivery_remember_person
            } else {
                chooseList.push(newItem)
            }
        }
        this.setState({ modalVisible: false, modalPopVisible: false, chooseList });
    }
    onCancelPress() {
        this.setState({ modalVisible: false, modalPopVisible: false });
    }
    onPopCancelPress() {
        this.setState({ modalVisible: false, modalPopVisible: false });
    }
    onEndAction() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        params.chooseList = this.state.chooseList
        navigate('AddDeliveryOrderEnd', params);
    }
    render() {
        const { addDeliveryOrder } = this.props;
        let num = this.state.chooseList.length;
        let numberCarsh = 0;
        let list = addDeliveryOrder.result ? addDeliveryOrder.result.good_list : [];
        list = list ? list : []
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <AddDeliveryPopModel chooseList={this.state.chooseList} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} onClear={() => { this.setState({ chooseList: [] }) }} />
                <AddDeliveryEditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                <LoadingListView
                    loading={addDeliveryOrder.loading || addDeliveryOrder.carLoading}
                    loadMore={addDeliveryOrder.loadMore}
                    listData={dataSource.cloneWithRows(list)}
                    renderRowView={this._renderItem} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 50, height: 50, padding: 6, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                            <Iconfont fontFamily={'OAIndexIcon'}
                                icon={'e6b5'} // 图标
                                iconColor={'#999'}
                                iconSize={30}
                            />
                            {
                                num > 0 ?
                                    <Text style={{ position: 'absolute', fontSize: 10, padding: 4, top: 6, right: 6, backgroundColor: '#fe6732', color: '#fff', borderRadius: 12 }}>{'' + num}</Text>
                                    : null
                            }
                        </View>
                    </TouchableHighlight>
                    <Text style={{ color: '#f80000' }}>{'￥' + numberCarsh + '元'}</Text>
                    <View style={{ flex: 1 }} />
                    {
                        this.state.chooseList.length > 0 ?
                            <TouchableHighlight onPress={this.onEndAction.bind(this)}>
                                <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'结算'}</Text>
                                </View>
                            </TouchableHighlight>
                            : null
                    }

                </View>
            </View >
        );
    }
}

export default AddDeliveryOrderPage;

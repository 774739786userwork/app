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
import * as utils from './utils'
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import ImageView from '../../components/ImageView'

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
        this.onClear = this.onClear.bind(this)
        this.carbaseinfo_id = null;
        this.state = {
            modalVisible: false,
            modalPopVisible: false,
            selectItem: {},
            chooseList: [],
            good_list: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const { addDeliveryOrder } = nextProps;
        if (addDeliveryOrder.errMsg) {
            Toast.show(addDeliveryOrder.errMsg);
            return;
        }
        const { action } = this.props;
        const selectCar = nextProps.selectCar
        if (selectCar.carbaseinfo_id && !addDeliveryOrder.loading && addDeliveryOrder.result.length == 0) {
            action.addDeliveryOrder(selectCar.carbaseinfo_id)
        } else if (selectCar.carbaseinfo_id != this.carbaseinfo_id) {
            action.addDeliveryOrder(selectCar.carbaseinfo_id)
        }
        this.carbaseinfo_id = selectCar.carbaseinfo_id

        this.setState({ good_list: addDeliveryOrder.result.good_list })

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
        let num = this.state.clear ? 0 : (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0)
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.image }} />
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
                                    <Text style={{ color: '#666' }}>{'单价(元)：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${item.price}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'数量：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${num}`}</Text>
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
    onClear() {
        let good_list = this.state.good_list
        let new_good_list = []
        let i = 0
        for (; i < good_list.length; i++) {
            let item = good_list[i]
            item.sale_quantity = 0
            //产品赠送量
            item.gifts_quantity = 0
            new_good_list.push(item)
        }

        this.setState({ good_list: new_good_list, chooseList: [] })
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
            newItem.delivery_remember_person = LoginInfo.getUserInfo().user_id;
            newItem.delivery_remember_person_name = LoginInfo.getUserInfo().user_real_name;
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
                oldItem.delivery_remember_person = newItem.delivery_remember_person;
                oldItem.delivery_remember_person_name = newItem.delivery_remember_person_name;
            } else {

                chooseList.push(newItem)
            }
        }
        for (var i = 0; i < chooseList.length; i++) {
            var tempItem = chooseList[i];
            if (tempItem.sale_quantity === 0 && tempItem.gifts_quantity === 0) {
                chooseList.splice(i, 1);
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
        const { result } = this.props.addDeliveryOrder;
        params.chooseList = this.state.chooseList
        let selectCar = this.props.selectCar;
        params.selectCar = selectCar;
        navigate('AddDeliveryOrderEnd', { ...params, ...result });
    }
    render() {
        const { addDeliveryOrder } = this.props;
        let chooseList = this.state.chooseList;
        let num = 0;
        let numberCarsh = 0;
        chooseList.map((item) => {
            num += item.sale_quantity + item.gifts_quantity
            numberCarsh += item.price * item.sale_quantity
        })
        numberCarsh = utils.fc(numberCarsh)
        let list = addDeliveryOrder.result ? this.state.good_list : [];
        list = list ? list : []
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <AddDeliveryPopModel onClear={this.onClear} onEndAction={this.onEndAction.bind(this)} chooseList={this.state.chooseList} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} />
                <AddDeliveryEditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                <LoadingListView
                    loading={addDeliveryOrder.loading}
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

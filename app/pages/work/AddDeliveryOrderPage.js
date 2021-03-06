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
import * as DateUtils from '../../utils/DateUtils'
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
import ImageView from '../../components/ImageView'
import * as NumberUtils from '../../utils/NumberUtils'

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
        this.renderHeader = this.renderHeader.bind(this)
        this._selectByDate = this._selectByDate.bind(this)
        this.selectCarAction = this.selectCarAction.bind(this)
        this.selectUserAction = this.selectUserAction.bind(this)
        this.carbaseinfo_id = null;

        this.state = {
            modalVisible: false,
            modalPopVisible: false,
            selectCar: {},
            ladingdate: DateUtils.getYearPreMonthDay(),
            deliverydate:DateUtils.getYearPreMonthDay(),
            selectItem: {},
            chooseList: [],
            good_list: [],
            downEmployeeIds : '',
            downEmployeeNames : '',
            num:0,   //数量总计
            numberCarsh:0  //金额总计
        };
    }

    componentWillReceiveProps(nextProps) {
        const { addDeliveryOrder } = nextProps;
        const { action, navigation } = this.props;
        const { params } = navigation.state;
        
        if (addDeliveryOrder.errMsg) {
            Toast.show(addDeliveryOrder.errMsg);
            return;
        }
        let selectCar = {}
        let ladingdate = this.state.ladingdate
        if (addDeliveryOrder.carList && !this.state.selectCar.platenumber && addDeliveryOrder.carList.length > 0) {
            selectCar = addDeliveryOrder.carList[0];
            this.setState({ selectCar })
        }
        if (selectCar.carbaseinfo_id && !addDeliveryOrder.loading && addDeliveryOrder.result.length == 0) {
            this.carbaseinfo_id = selectCar.carbaseinfo_id
            action.addDeliveryOrder(selectCar.carbaseinfo_id, ladingdate, params.customersId,params.purchaseId)
        } else if (selectCar.carbaseinfo_id && selectCar.carbaseinfo_id != this.carbaseinfo_id) {
            this.carbaseinfo_id = selectCar.carbaseinfo_id
            action.addDeliveryOrder(selectCar.carbaseinfo_id, ladingdate, params.customersId,params.purchaseId)
        }
        this.setState({ good_list: addDeliveryOrder.result.good_list });
        this.initUpdate(addDeliveryOrder.result.good_list); //初始化数据
    }
    _selectByDate(ladingdate) {
        const { action, navigation } = this.props;
        const { params } = navigation.state;
        action.addDeliveryOrder(this.carbaseinfo_id, ladingdate, params.customersId,params.purchaseId)
        this.setState({ ladingdate: ladingdate })
    }

    _selectDeliveryDate(deliverydate){
         if(deliverydate < this.state.ladingdate){
             Toast.show('送货日期不能小于提货日期！')
         }else{
             this.setState({deliverydate})
        }
    }
    selectCarAction() {
        const { action, navigation, addDeliveryOrder } = this.props;
        const { params } = navigation.state;
        if (addDeliveryOrder.carList.length === 0) {
            Toast.show('暂无车辆')
        } else if (addDeliveryOrder.carList.length === 1) {
            Toast.show('当前只有该辆车')
        } else {
            navigation.navigate('ShowSelectCar', {
                carList: addDeliveryOrder.carList, callback: (data) => {
                    this.carbaseinfo_id = data.carbaseinfo_id
                    action.addDeliveryOrder(this.carbaseinfo_id, this.state.ladingdate, params.customersId,params.purchaseId)
                    this.setState({ selectCar: data })
                }
            })
        }
    }
    selectUserAction() {
        const { navigate } = this.props.navigation;
        navigate('SelectMuUser', {
            callback: (data) => {
                let downEmployeeIds = data.ids;
                let downEmployeeNames = data.names;
                this.setState({ downEmployeeIds,downEmployeeNames })
            }
        });
    }
    componentDidMount() {
        const { action, navigation } = this.props;
        const { params } = navigation.state;
        InteractionManager.runAfterInteractions(() => {
            action.getCar4Delivery(params.purchaseId);
        });
    }

    initUpdate(listData){
        let num = 0;
        let numberCarsh = 0;
        let goodList = [];
        if(listData){
            listData.map((a) => {
                if(a.purchase_quantity > 0 && a.stock > 0){
                    a.delivery_remember_person = LoginInfo.getUserInfo().user_id;
                    a.delivery_remember_person_name = LoginInfo.getUserInfo().user_real_name;
                    a.product_sum = a.price * a.sale_quantity + NumberUtils.FloatMul(NumberUtils.fc(a.foregift),(a.gifts_quantity  + a.sale_quantity))
                    a.product_foregift_sum = NumberUtils.FloatMul(a.foregift, (a.gifts_quantity + a.sale_quantity))
                    goodList.push(a);
                    num += a.sale_quantity + a.gifts_quantity
                    numberCarsh += a.price * a.sale_quantity + a.foregift * a.sale_quantity + a.foregift * a.gifts_quantity
                }
            })
        }
        this.setState({ num, numberCarsh,chooseList:goodList});
    }
    _rowOnPress(selectItem) {
        this.setState({ modalVisible: true, selectItem });
    }

    _renderItem = (item, index) => {
       
        let num = this.state.clear ? 0 : (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0)
        let url =  item.image;
        let empty = item.stock === 0;
        if(empty){
           url = "ic_empty";
        }
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
                disabled={empty}
            >
                <View style={{ backgroundColor: empty ?'#f2f2f2' :'#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: url }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 34, paddingLeft: 12, marginBottom: 3, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{item.name}</Text>
                                <View style={{ flex: 1 }} />
                                <Text style={{ color: '#666', marginRight: 8, fontSize: 12 }}></Text>
                            </View>
                            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text style={{ color: '#666' }}>{item.specifications ? item.specifications : ''}</Text>
                                    <Text style={{ color: '#666' }}>{item.salePolicy ? item.salePolicy : ''}</Text>
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
        let num = 0;
        let numberCarsh = 0;

        this.setState({num,numberCarsh, good_list: new_good_list, chooseList: [] })
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
                oldItem.product_sum = NumberUtils.fc(newItem.product_sum)
                //单个产品的押金总额
                oldItem.product_foregift_sum = NumberUtils.fc(newItem.product_foregift_sum)
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
        let num = 0;
        let numberCarsh = 0;
        chooseList.map((item) => {
            num += item.sale_quantity + item.gifts_quantity
            if (!item.isDistribution) {
                numberCarsh += item.price * item.sale_quantity + item.foregift * item.sale_quantity + item.foregift * item.gifts_quantity
            }
        })
        numberCarsh = NumberUtils.fc(numberCarsh)
        this.setState({ modalVisible: false, modalPopVisible: false,chooseList, num,numberCarsh });
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
        let selectCar = this.state.selectCar;
        params.selectCar = selectCar;
        params.downEmployeeIds = this.state.downEmployeeIds;
        params.num = this.state.num;
        params.numberCarsh = this.state.numberCarsh;
        params.deliverydate = this.state.deliverydate;
        // if(!this.state.downEmployeeNames){
        //      Toast.show('请选择搬运工！');
        //      return;
        // }else{
            navigate('AddDeliveryOrderEnd', { ...params, ...result });
        // }
    }
    renderHeader() {
        return <View>
            <TouchableOpacity onPress={this.selectCarAction}>
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>{'车牌号'}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', fontSize: 14 }}>{this.state.selectCar.platenumber ? this.state.selectCar.platenumber : '暂无车辆'}</Text>
                    <View>
                        <Iconfont
                            icon={'e66e'} // 图标
                            iconColor={'#999'}
                            iconSize={22}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 16 }}>{'提货日期'}</Text>
                <View style={{ flex: 1 }} />
                <DatePicker
                    style={{ width: 100, }}
                    date={this.state.ladingdate}
                    customStyles={{
                        dateInput: { borderWidth: 0 },
                        dateText: { color: '#999', textAlign: 'left' }
                    }}
                    mode="date"
                    showIcon={false}
                    format="YYYY-MM-DD"
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    onDateChange={(date) => {
                        this._selectByDate(date)
                    }}
                />
                <View>
                    <Iconfont
                        icon={'e66e'} // 图标
                        iconColor={'#999'}
                        iconSize={22}
                    />
                </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 16 }}>{'送货日期'}</Text>
                <View style={{ flex: 1 }} />
                <DatePicker
                    style={{ width: 100, }}
                    date={this.state.deliverydate}
                    customStyles={{
                        dateInput: { borderWidth: 0 },
                        dateText: { color: '#999', textAlign: 'left' }
                    }}
                    mode="date"
                    showIcon={false}
                    format="YYYY-MM-DD"
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    onDateChange={(date) => {
                        this._selectDeliveryDate(date)
                    }}
                />
                <View>
                    <Iconfont
                        icon={'e66e'} // 图标
                        iconColor={'#999'}
                        iconSize={22}
                    />
                </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
            
            {/* <TouchableOpacity onPress={this.selectUserAction}>
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>{'卸货搬运工'}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', fontSize: 14 }}>{this.state.downEmployeeNames ? this.state.downEmployeeNames : '请选择搬运工'}</Text>
                    <View>
                        <Iconfont
                            icon={'e66e'} // 图标
                            iconColor={'#999'}
                            iconSize={22}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} /> */}
        </View>
    }
    render() {
        const { addDeliveryOrder } = this.props;
        let chooseList = this.state.chooseList;
        let list = addDeliveryOrder.result ? this.state.good_list : [];
        list = list ? list : []
        
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <AddDeliveryPopModel onClear={this.onClear} onEndAction={this.onEndAction.bind(this)} chooseList={chooseList} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} />
                <AddDeliveryEditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                {
                    this.renderHeader()
                }
                <LoadingListView
                    loading={addDeliveryOrder.loading}
                    loadMore={addDeliveryOrder.loadMore}
                    listData={dataSource.cloneWithRows(list)}
                    renderRowView={this._renderItem} />

                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 50, height: 50, padding: 6, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                            <Iconfont fontFamily={'OAIndexIcon'}
                                icon={'e6b5'} // 图标
                                iconColor={'#999'}
                                iconSize={30}
                            />
                            {
                                this.state.num > 0 ?
                                    <Text style={{ position: 'absolute', fontSize: 10, padding: 4, top: 6, right: 6, backgroundColor: '#fe6732', color: '#fff', borderRadius: 12 }}>{'' + this.state.num}</Text>
                                    : null
                            }
                        </View>
                    </TouchableHighlight>
                    <Text style={{ color: '#f80000' }}>￥{this.state.numberCarsh + '元'}</Text>
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

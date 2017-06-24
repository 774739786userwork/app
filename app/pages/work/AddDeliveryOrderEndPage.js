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
    TouchableOpacity,
    InteractionManager,
    FlatList,
    Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import LadProductItem from './components/LadProductItem'
import SaveModel from './components/SaveModel'
import Spinner from 'react-native-loading-spinner-overlay';
import RemarkEditeModel from './RemarkEditeModel'
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
import ImageView from '../../components/ImageView'
import { NavigationActions } from 'react-navigation'

const WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * 送货单 结算
 */
class AddDeliveryOrderEndPage extends React.Component {
    constructor(props) {
        super(props);
        this.onConfirmPress = this.onConfirmPress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this.dosubmitAction = this.dosubmitAction.bind(this);
        const { params } = this.props.navigation.state;
        this.renderFooter = this.renderFooter.bind(this)

        //铺货
        this.distribution_sum = 0
        let num = 0;
        let numberCarsh = 0;

        params.chooseList.map((item) => {
            num += item.sale_quantity + item.gifts_quantity
            numberCarsh += item.price * item.sale_quantity
            if (item.isDistribution) {
                this.distribution_sum += item.price * item.sale_quantity
            }
        })
        var toChange = numberCarsh + '';
        var b = toChange.split(".");
        if (b.length > 1) {
            this.small_change_sum = parseFloat('0.' + b[1])
        } else {
            this.small_change_sum = 0.0
        }
        //总计销售金额
        this.total_sum = 0;
        //押金
        this.foregift_sum = 0;


        this.num = num;
        this.numberCarsh = numberCarsh;
        this.state = {
            chooseList: params.chooseList,
            //实收金额
            paid_total_sum: numberCarsh - this.small_change_sum,
            isOpenChange: true,
            discount_sum: 0,
            remark: '',
            modalVisible: false,
            showSpinner: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            headerRemarkRightPress: this.headerRemarkRightPress,
        })
    }
    headerRemarkRightPress = () => {
        this.setState({ modalVisible: true });
    }
    onCancelPress() {
        this.setState({ modalVisible: false });
    }
    onConfirmPress(content) {
        this.setState({ modalVisible: false, remark: content });
    }
    dosubmitAction() {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;
        const org_pinyin = LoginInfo.getUserInfo().org_pinyin;
        //total_sum	Double	总计销售金额
        // paid_total_sum	Double	实收金额
        // foregift_sum	Double	押金
        // small_change_sum	Double	抹零金额
        // unpaid_sum	Double	未收金额
        // distribution_sum	Double	铺货总额
        // remark	String	备注信息
        const { params } = this.props.navigation.state;
        var date = new Date();
        let month = date.getMonth() + 1;
        var currentTime = date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + date.getDate();

        let saveParams = {};
        saveParams.user_id = user_id;
        saveParams.organization_id = organization_id;
        saveParams.org_pinyin = org_pinyin;
        saveParams.token = token;
        saveParams.customer_id = params.customersId
        saveParams.car_id = params.selectCar.carbaseinfo_id
        saveParams.car_number = params.selectCar.platenumber
        saveParams.delivery_date = currentTime
        saveParams.contact_mobile = params.contacts[0].mobile1;
        saveParams.contact_name = params.contacts[0].name;
        saveParams.source_equipment = '1'
        saveParams.lat = params.lat
        saveParams.lng = params.lng
        saveParams.lading_date = params.lading_date
        saveParams.ladingbill_id = params.ladingbill_id
        saveParams.ladingbill_serialnumber = params.ladingbill_serialnumber

        saveParams.total_sum = this.numberCarsh;
        saveParams.paid_total_sum = this.state.paid_total_sum;
        saveParams.foregift_sum = this.foregift_sum;
        saveParams.small_change_sum = this.setState.isOpenChange ? this.small_change_sum : 0;
        let unpaid_sum = this.state.isOpenChange ? this.numberCarsh - this.state.paid_total_sum - this.small_change_sum : this.numberCarsh - this.state.paid_total_sum
        saveParams.unpaid_sum = unpaid_sum.toFixed(2)
        saveParams.distribution_sum = this.distribution_sum;
        saveParams.remark = this.state.remark;

        let good_list = []
        let showErr = false;
        this.state.chooseList.map((item) => {
            let gItem = {}
            gItem.sequence = item.sequence
            gItem.product_id = item.id
            gItem.product_name = item.name
            gItem.sale_quantity = item.sale_quantity
            gItem.gifts_quantity = item.gifts_quantity
            gItem.price = item.price
            gItem.product_sum = item.stock
            gItem.delivery_remember_person = item.delivery_remember_person
            if (!item.delivery_remember_person) {
                showErr = true
            }
            good_list.push(gItem)
        })
        saveParams.good_list = JSON.stringify(good_list);
        this.setState({ showSpinner: true })
        const { navigation } = this.props;

        FetchManger.postUri('/mobileServiceManager/deliveryNotes/addDeliveryNotes.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {

                const navigationAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'BleManager' }),
                    ]
                })
                navigation.dispatch(navigationAction)
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            console.log(error)
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }

    _renderItem = (item, index) => {
        let num = (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0)

        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`} >
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
                                <Text style={{ color: '#666' }}>{'单价：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.price}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'数量：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${num}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: 40, paddingRight: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', marginRight: 12 }}>{`计量人`}</Text>
                    <TouchableHighlight style={{ borderColor: '#0081d4', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onSelectUser.bind(this, item)}>
                        <View style={{ flexDirection: 'row', width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderColor: '#0081d4', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                            <Text style={{ color: '#0081d4' }}>{item.delivery_remember_person_name ? item.delivery_remember_person_name : `请选择`}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>)
    }
    _onSelectUser(item) {
        const { navigate } = this.props.navigation;
        navigate('SelectUser', {
            callback: (data) => {
                item.delivery_remember_person = data.id;
                item.delivery_remember_person_name = data.name;
                this.setState({ chooseList: this.state.chooseList })
            }
        });
    }
    _rowOnPress(item) {

    }
    _onItemPress() {

    }
    //抹零开关
    _onChangePress() {
        if (!this.state.isOpenChange) {
            this.setState({ paid_total_sum: this.numberCarsh - this.small_change_sum })
        } else {
            this.setState({ paid_total_sum: this.numberCarsh })
        }
        this.setState({ isOpenChange: !this.state.isOpenChange })

    }
    renderFooter() {

        return (
            <View style={{ padding: 12, backgroundColor: '#fff9f9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableHighlight style={{ borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }} onPress={this._onChangePress.bind(this)}>
                            <View style={{ flexDirection: 'row', width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }}>
                                <Text style={{ color: '#f80000' }}>{this.state.isOpenChange ? `取消抹零` : '抹零'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={{ color: '#f80000', marginLeft: 4 }}>{`￥:${this.small_change_sum}`}</Text>
                    </View>
                    <View style={{ flex: 1, height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>实收(元):</Text>
                        <TextInput style={{ width: 100, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            value={this.state.paid_total_sum + ''}
                            keyboardType={'numeric'}
                            onChangeText={(paid_total_sum) => {
                                paid_total_sum = paid_total_sum ? paid_total_sum : '0'
                                let num = parseFloat(paid_total_sum);
                                if (!isNaN(num)) {
                                    if (paid_total_sum.length > 1 && paid_total_sum.charAt(paid_total_sum.length - 1) === '.') {
                                        num += '.';
                                    }
                                    this.setState({ paid_total_sum: num })
                                } else {
                                    this.setState({ paid_total_sum: this.state.paid_total_sum })
                                }
                            }}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 30, flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>优惠金额(元):</Text>
                        <TextInput style={{ width: 60, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            value={this.state.discount_sum + ''}
                            keyboardType={'numeric'}
                            onChangeText={(discount_sum) => {
                                discount_sum = discount_sum ? discount_sum : '0'
                                let num = parseFloat(discount_sum);
                                if (!isNaN(num)) {
                                    if (discount_sum.length > 1 && discount_sum.charAt(discount_sum.length - 1) === '.') {
                                        num += '.';
                                    }
                                    this.setState({ discount_sum: num })
                                } else {
                                    this.setState({ discount_sum: this.state.discount_sum })
                                }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{`铺货总额`}</Text>
                        <Text style={{ color: '#666' }}>{`￥：${this.distribution_sum}`}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{`共${this.num}件商品,总计${this.state.isOpenChange ? this.numberCarsh - this.small_change_sum : this.numberCarsh}元,押金总计0元`}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Text style={{ color: '#f80000' }}>{`备注:${this.state.remark}`}</Text>
                </View>
            </View>)
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contacts[0].name}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16, marginLeft: 12 }}>{`${params.contacts[0].mobile1}`}</Text>
                    </View>
                    <View style={{ height: 26, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.address}`}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ flex: 1 }}>
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource.cloneWithRows(params.chooseList)}
                        renderRow={this._renderItem}
                    />
                </View>
                {
                    this.renderFooter()
                }
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={this.dosubmitAction} disabled={this.state.paid_total_sum > this.numberCarsh}>
                        <View style={{ width: 160, height: 50, backgroundColor: this.state.paid_total_sum > this.numberCarsh ? '#c4c4c4' : '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{`收款￥${ this.state.paid_total_sum }`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <RemarkEditeModel content={this.state.remark} modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} onConfirmPress={this.onConfirmPress} />
                <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default AddDeliveryOrderEndPage;

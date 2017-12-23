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
    Platform,
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
import * as NumberUtils from '../../utils/NumberUtils'
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
        this.sureBtnClick = this.sureBtnClick.bind(this);
        this.dosubmitAction = this.dosubmitAction.bind(this);
        this.dofalseAction = this.dofalseAction.bind(this);
        const { params } = this.props.navigation.state;
        this.renderFooter = this.renderFooter.bind(this)

        //铺货总额
        this.distribution_sum = 0
        //总计数量
        this.num = params.num;
        //总计销售金额
        this.total_sum = params.numberCarsh;
        //押金
        this.foregift_sum = 0;
        params.chooseList.map((item) => {
            if(item.purchase_quantity > 0){
                this.foregift_sum += NumberUtils.FloatMul(item.foregift, (item.gifts_quantity + item.sale_quantity))
            }else{
                this.foregift_sum = NumberUtils.FloatAdd(this.foregift_sum, item.product_foregift_sum)
            }

            if (item.isDistribution) {
                this.distribution_sum += NumberUtils.FloatMul(item.price, item.sale_quantity)
            }
        })
        this.foregift_sum = NumberUtils.fc(this.foregift_sum)

        let distribution = (this.distribution_sum + '').split('.');
        //铺货总额
        this.distribution_sum = distribution[0]
        //抹零
        this.small_change_sum = 0.0
        var b = (this.total_sum + '').split(".");
        if (b.length > 1) {
            this.small_change_sum = '0.' + b[1]
        }
        //优惠金额
        this.small_change_sum = NumberUtils.fc(this.small_change_sum)

        //实收金额
        this.paid_total_sum = NumberUtils.FloatSub(this.total_sum, this.small_change_sum)
        this.paid_total_sum = NumberUtils.fc(this.paid_total_sum)
        this.state = {
            chooseList: params.chooseList,
            //实收金额
            paid_total_sum: this.paid_total_sum,
            //是否开启 抹零
            isOpenChange: true,
            //优惠金额
            discount_sum: 0,
            //备注
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

    sureBtnClick() {
        const { params } = this.props.navigation.state;
        if(!params.purchaseSerialnumber){
            this.dosubmitAction()
        }else{
            Alert.alert('', '确认订单是否已全部配送?',
            [
              { text: '是', onPress: this.dosubmitAction },
              { text: '否', onPress: this.dofalseAction }
            ]
          );
        }
    }

    //未配送完成
    dofalseAction(){
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
        //isDeliveryEnd  订单是否配送
        const { params } = this.props.navigation.state;
        var date = new Date();
        let month = date.getMonth() + 1;
        let saveParams = {};
        saveParams.user_id = user_id;
        saveParams.organization_id = organization_id;
        saveParams.org_pinyin = org_pinyin;
        saveParams.token = token;
        saveParams.customer_id = params.customersId
        saveParams.car_id = params.selectCar.carbaseinfo_id
        saveParams.car_number = params.selectCar.platenumber
        saveParams.contact_mobile = params.contacts[0].mobile1;
        saveParams.contact_name = params.contacts[0].name;
        saveParams.source_equipment = '1'
        saveParams.lat = params.lat
        saveParams.lng = params.lng
        saveParams.ladingdate = params.ladingdate
        saveParams.deliverydate = params.deliverydate
        saveParams.ladingbill_id = params.ladingbill_id
        saveParams.ladingbill_serialnumber = params.ladingbill_serialnumber
        saveParams.downEmployeeIds = params.downEmployeeIds;
        if (!params.purchaseSerialnumber) {
            saveParams.purchaseSerialnumber = ''
        } else {
            saveParams.purchaseSerialnumber = params.purchaseSerialnumber
            saveParams.isDeliveryEnd = '1'
        }
        saveParams.salesman_id = params.salesman_id
        saveParams.total_sum = NumberUtils.fc(this.total_sum);
        saveParams.paid_total_sum = NumberUtils.fc(this.state.paid_total_sum);
        saveParams.foregift_sum = this.foregift_sum;
        //抹零
        saveParams.small_change_sum = this.state.isOpenChange ? this.small_change_sum : 0;
        //优惠金额
        saveParams.discount_sum = NumberUtils.fc(this.state.discount_sum)
        let unpaid_sum = NumberUtils.FloatSub(NumberUtils.FloatSub(saveParams.total_sum, saveParams.discount_sum), NumberUtils.FloatAdd(saveParams.paid_total_sum, (this.state.isOpenChange ? this.small_change_sum : 0)))
        saveParams.unpaid_sum = Math.abs(NumberUtils.fc(unpaid_sum))
        //铺货总额
        saveParams.distribution_sum = this.distribution_sum;
        saveParams.remark = this.state.remark;

        let good_list = []
        this.state.chooseList.map((item) => {
            let gItem = {}
            gItem.sequence = item.sequence
            gItem.product_id = item.id
            gItem.product_name = item.name
            gItem.sale_quantity = item.sale_quantity
            gItem.gifts_quantity = item.gifts_quantity
            gItem.foregift = item.foregift
            gItem.price = item.price
            gItem.sysPrice = item.sysPrice
            gItem.isDistribution = item.isDistribution ? 1 : 0;
            gItem.product_sum = item.product_sum
            gItem.product_foregift_sum = item.product_foregift_sum
            gItem.delivery_remember_person = item.delivery_remember_person
            good_list.push(gItem)
        })
        saveParams.good_list = JSON.stringify(good_list);
        this.setState({ showSpinner: true })
        const { navigation } = this.props;

        params.distribution_sum = saveParams.distribution_sum
        params.total_discount_sum = saveParams.discount_sum
        params.total_sum = saveParams.total_sum
        params.total_foregift = saveParams.foregift_sum
        params.paid_total_sum = saveParams.paid_total_sum
        params.unpaid_total_sum = saveParams.unpaid_sum

        params.num = this.num
        params.creator = true
        params.print = true
        FetchManger.postUri('/mobileServiceManager/deliveryNotes/addDeliveryNotes.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                const navigationAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'BleManager', params: params })
                    ]
                })
                navigation.dispatch(navigationAction)
                Toast.show('保存成功')
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            console.log(error)
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }

    //确认配送完成
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
        //isDeliveryEnd  订单是否配送
        const { params } = this.props.navigation.state;
        var date = new Date();
        let month = date.getMonth() + 1;
        let saveParams = {};
        saveParams.user_id = user_id;
        saveParams.organization_id = organization_id;
        saveParams.org_pinyin = org_pinyin;
        saveParams.token = token;
        saveParams.customer_id = params.customersId
        saveParams.car_id = params.selectCar.carbaseinfo_id
        saveParams.car_number = params.selectCar.platenumber
        saveParams.contact_mobile = params.contacts[0].mobile1;
        saveParams.contact_name = params.contacts[0].name;
        saveParams.source_equipment = '1'
        saveParams.lat = params.lat
        saveParams.lng = params.lng
        saveParams.ladingdate = params.ladingdate
        saveParams.deliverydate = params.deliverydate
        saveParams.ladingbill_id = params.ladingbill_id
        saveParams.ladingbill_serialnumber = params.ladingbill_serialnumber
        saveParams.downEmployeeIds = params.downEmployeeIds;
        if (!params.purchaseSerialnumber) {
            saveParams.purchaseSerialnumber = ''
        } else {
            saveParams.purchaseSerialnumber = params.purchaseSerialnumber
            saveParams.isDeliveryEnd = '0'
        }
        saveParams.salesman_id = params.salesman_id
        saveParams.total_sum = NumberUtils.fc(this.total_sum);
        saveParams.paid_total_sum = NumberUtils.fc(this.state.paid_total_sum);
        saveParams.foregift_sum = this.foregift_sum;
        //抹零
        saveParams.small_change_sum = this.state.isOpenChange ? this.small_change_sum : 0;
        //优惠金额
        saveParams.discount_sum = NumberUtils.fc(this.state.discount_sum)
        let unpaid_sum = NumberUtils.FloatSub(NumberUtils.FloatSub(saveParams.total_sum, saveParams.discount_sum), NumberUtils.FloatAdd(saveParams.paid_total_sum, (this.state.isOpenChange ? this.small_change_sum : 0)))
        saveParams.unpaid_sum = Math.abs(NumberUtils.fc(unpaid_sum))
        //铺货总额
        saveParams.distribution_sum = this.distribution_sum;
        saveParams.remark = this.state.remark;

        let good_list = []
        this.state.chooseList.map((item) => {
            let gItem = {}
            gItem.sequence = item.sequence
            gItem.product_id = item.id
            gItem.product_name = item.name
            gItem.sale_quantity = item.sale_quantity
            gItem.gifts_quantity = item.gifts_quantity
            gItem.foregift = item.foregift
            gItem.price = item.price
            gItem.sysPrice = item.sysPrice
            gItem.isDistribution = item.isDistribution ? 1 : 0;
            gItem.product_sum = item.product_sum
            gItem.product_foregift_sum = item.product_foregift_sum
            gItem.delivery_remember_person = item.delivery_remember_person
            good_list.push(gItem)
        })
        saveParams.good_list = JSON.stringify(good_list);
        this.setState({ showSpinner: true })
        const { navigation } = this.props;

        params.distribution_sum = saveParams.distribution_sum
        params.total_discount_sum = saveParams.discount_sum
        params.total_sum = saveParams.total_sum
        params.total_foregift = saveParams.foregift_sum
        params.paid_total_sum = saveParams.paid_total_sum
        params.unpaid_total_sum = saveParams.unpaid_sum
        params.deliverydate = saveParams.deliverydate
        params.num = this.num
        params.creator = true
        params.print = true
        // alert(saveParams.deliverydate)
        FetchManger.postUri('/mobileServiceManager/deliveryNotes/addDeliveryNotes.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                const navigationAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'BleManager', params: params })
                    ]
                })
                navigation.dispatch(navigationAction)
                Toast.show('保存成功')
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
        // let product_sum = item.price * item.sale_quantity + NumberUtils.FloatMul(NumberUtils.fc(item.foregift),(item.gifts_quantity  + item.sale_quantity))
       
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`} >
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                        <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.image }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 34, paddingLeft: 10, marginBottom: 8, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{item.name}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'售价：'}</Text>
                                <Text style={{ color: '#f80000' }}>¥{`${item.price}`}X{`${item.sale_quantity}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#f80000', marginLeft: 20 }}>¥{`${NumberUtils.fc(item.product_sum)}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'赠送：'}</Text>
                                <Text style={{ color: '#666' }}>{item.gifts_quantity ? item.gifts_quantity : 0}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'数量小计：'}</Text>
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
            this.setState({ paid_total_sum: this.paid_total_sum })
        } else {
            this.setState({ paid_total_sum: NumberUtils.FloatAdd(this.paid_total_sum, this.small_change_sum) })
        }
        this.setState({ isOpenChange: !this.state.isOpenChange })

    }
    renderFooter() {
        return (
            <View style={{ padding: 10, backgroundColor: '#fff9f9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableHighlight style={{ borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }} onPress={this._onChangePress.bind(this)}>
                            <View style={{ flexDirection: 'row', width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }}>
                                <Text style={{ color: '#f80000' }}>{this.state.isOpenChange ? `取消抹零` : '抹零'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={{ color: '#f80000', marginLeft: 4 }}>¥{`${this.small_change_sum}`}</Text>
                    </View>
                    <View style={{ flex: 1, height: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>实收(元):</Text>
                        <TextInput style={{ width: 100, height: 25, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
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
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 25, flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>优惠金额(元):</Text>
                        <TextInput style={{ width: 60, height: 25, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
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
                        <Text style={{ color: '#666' }}>¥{`：${this.distribution_sum}`}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <Text style={{ color: '#f80000' }}>{`备注:${this.state.remark}`}</Text>
                </View>
            </View>)
    }

    render() {
        const { params } = this.props.navigation.state;

        let canSave = NumberUtils.FloatSub(NumberUtils.FloatAdd(NumberUtils.FloatAdd(this.state.paid_total_sum, this.state.discount_sum), (this.state.isOpenChange ? this.small_change_sum : 0)), this.total_sum) > 0
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
                    <View style={{ flexDirection: 'column', height: 50 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{`共${this.num}件商品,总计${this.total_sum}元`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 3 }}>
                            <Text style={{ color: '#666' }}>{`押金总计${this.foregift_sum}元`}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={this.sureBtnClick} disabled={canSave}>
                        <View style={{ width: 160, height: 50, backgroundColor: canSave ? '#c4c4c4' : '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{`收款¥${this.state.paid_total_sum}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    Platform.OS === 'ios' ?
                        <KeyboardSpacer /> : null
                }
                <RemarkEditeModel content={this.state.remark} modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} onConfirmPress={this.onConfirmPress} />
                <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default AddDeliveryOrderEndPage;

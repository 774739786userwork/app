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
    DatePickerAndroid,
    TouchableHighlight
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, FetchManger, Spinner, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SurplusEditeModel from './SurplusEditeModel'
import { NavigationActions } from 'react-navigation'

const WINDOW_WIDTH = Dimensions.get('window').width;

/**
 * 车余货单查询及余货打印
 * @param {*} AddDayCount 
 */
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let carId = '';
class GetCarSurplusGoodsListPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this._selectByDate = this._selectByDate.bind(this)
        this._selectCar = this._selectCar.bind(this)

        this.onSetCar = this.onSetCar.bind(this);
        
        let today = GetDateStr(0);
        this.state = {
            showSpinner: false,
            modalVisible: false,
            loadingdate: today,
            car: {
                platenumber: '请选择车牌号'
            },
            selectItem: {},
            data: []
        }
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadCar();
        });
    }

    loadCar() {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/getCarInfoJson.page', { token, user_id }).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    if (data && data.length > 0) {
                        this.onSetCar(data[0]);
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        const { getCarstockProductList } = nextProps;

        if (getCarstockProductList.errMsg) {
            Toast.show(getCarstockProductList.errMsg);
        }
        this.setState({ data: getCarstockProductList.result })
    }

    _rowOnPress(selectItem) {
        this.setState({ modalVisible: true, selectItem });
    }
    //product_stock_quantity 后台返回的车余货数量
    //remainCount 填入的余货数量

    _renderItem = (item, index) => {
        let remainCount = item.remainCount ? item.remainCount : 0
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                    <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex:1, flexDirection:'row'}}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex:1, flexDirection:'row'}}>
                            <Text style={{ color: '#666' }}>{'单位：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.product_unit}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'规格：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.product_specifications}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'车余货：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${ item.product_stock_quantity }`}</Text>
                        </View>
                        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'余：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${ remainCount ? remainCount : item.product_stock_quantity }`}</Text>
                        </View> */}
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    
    _onSurePrintPress() {
        let params = { YH: true }
        // let goods_list = [];
        // this.state.data.map((item) => {
        //     let gItem = {}
        //     if (item.remainCount && item.remainCount > 0) {
        //         gItem.product_id = item.product_id
        //         gItem.product_name = item.product_name
        //         gItem.product_unit = item.product_unit
        //         gItem.product_stock_quantity = item.remainCount
        //         goods_list.push(gItem)
        //     }
        // })
        
        params.chooseList = this.state.data
        params.selectCar = this.state.car
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;

        let saveParams = {}
        saveParams.user_id = user_id;
        saveParams.token = token;
        saveParams.carbaseinfo_id = params.selectCar.carbaseinfo_id
        saveParams.platenumber = params.selectCar.platenumber
        saveParams.loading_date = this.state.loadingdate
        saveParams.goods_list = JSON.stringify(this.state.data);
        const { navigation } = this.props;
        this.setState({ showSpinner: true })
        FetchManger.postUri('mobileServiceManager/carmanager/addCarRemain.page', saveParams).then((responseData) => {
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
                this.setState({ showSpinner: false })
            } else {
                Toast.show(responseData.msg)
                this.setState({ showSpinner: false })
            }
        }).catch((error) => {
            console.log(error)
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }

    onConfirmPress(id, newCount) {
        const { action } = this.props;
        let selectItem = this.state.selectItem;
        // selectItem.remainCount = newCount;
        selectItem.product_stock_quantity = newCount;
        this.setState({ modalVisible: false, selectItem });
    }
    onCancelPress() {
        this.setState({ modalVisible: false });
    }

    //选日期
    _selectByDate(dateValue) {
        this.state.loadingdate = dateValue;
        const { action } = this.props;
        action.getCarstockProductList(carId, dateValue);
    }

    //选车牌
    _selectCar() {
        const { action, navigation } = this.props;
        navigation.navigate('SelectCar', {
            selectCar: true, callback: this.onSetCar
        });
    }

    onSetCar(data) {
        const { action, navigation } = this.props;
        carId = data['carbaseinfo_id']
        this.setState({ car: data });
        action.getCarstockProductList(carId, this.state.loadingdate);
    }

    render() {
        const { getCarstockProductList } = this.props;
        let list = getCarstockProductList.result ? this.state.data : [];
        list = list ? list : []
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 10, backgroundColor: '#f2f2f2' }} ></View>
                <SurplusEditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                <TouchableOpacity onPress={this._selectCar}>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 18 }}>{'车牌号'}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#999', fontSize: 14 }}>{this.state.car.platenumber}</Text>
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
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 10, paddingRight: 12, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 18 }}>{'提货日期'}</Text>
                    <View style={{ flex: 1 }} />
                    <DatePicker
                        style={{ width: 100, }}
                        date={this.state.loadingdate}
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
                <View style={{ height: 30, paddingLeft: 10, backgroundColor: '#f2f2f2', justifyContent: 'center' }} >
                    <Text style={{ color: '#999' }}>{'车余货产品信息'}</Text>
                </View>
                <LoadingListView
                    loading={getCarstockProductList.loading}
                    loadMore={getCarstockProductList.loadMore}
                    listData={dataSource.cloneWithRows(list)}
                    renderRowView={this._renderItem} />
                {
                    list.length > 0 ?
                        <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                            
                            <View style={{ flex: 1 }} />
                            <TouchableHighlight onPress={this._onSurePrintPress.bind(this)}>
                                <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'车余货打印'}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        : null
                }
                <View><Spinner visible={this.state.showSpinner} textContent={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default GetCarSurplusGoodsListPage;

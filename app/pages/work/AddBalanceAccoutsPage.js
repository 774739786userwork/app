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
    FlatList,
    TouchableHighlight,
    Alert
} from 'react-native';
import { Iconfont, Toast, LoadingView, FetchManger, LoginInfo, Spinner } from 'react-native-go';
import DatePicker from 'react-native-datepicker'
import ImageView from '../../components/ImageView'
import { NavigationActions } from 'react-navigation'
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const WINDOW_WIDTH = Dimensions.get('window').width;
import * as DateUtils from '../../utils/DateUtils'
let listViewData = []
let valeMap = {}
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}
/**
 * 结算单
 */
class AddBalanceAccoutsPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectByDate = this._selectByDate.bind(this)
        this._selectCar = this._selectCar.bind(this)
        this.loadDataAction = this.loadDataAction.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.onSave = this.onSave.bind(this);

        let today = GetDateStr(0);
        this.state = {
            loadingdate: today,
            car: {
                platenumber: '请选择车牌号'
            },
            listData: [],
            data: {
                settleProductlist: []
            },
            loading: false,
            showSpinner: false
        }
    }
    _selectByDate(dateValue) {
        //  this.setState({ loadingdate: dateValue,loading: true });
        this.loadDataAction(dateValue, this.state.car);
    }
    _selectCar() {
        const { navigation } = this.props;
        navigation.navigate('SelectCar', {
            selectCar: true, callback: (data) => {
                this.loadDataAction(this.state.loadingdate, data);
            }
        });

    }

    onSave() {
        const { navigation } = this.props;
        const userInfo = LoginInfo.getUserInfo();
        let data = this.state.data;
        let loadingdate = this.state.loadingdate;
        let car_id = this.state.car.carbaseinfo_id;
        let receivable_sum = data.receivable_sum;
        let paid_sum = data.paid_sum;
        let foregift_sum = data.foregift_sum;
        let unpaid_sum = data.unpaid_sum;
        let small_change_sum = data.small_change_sum;
        let distribution_sum = data.distribution_sum;
        let favourable_sum = data.favourable_sum;
        let settleProductlistJSON =  JSON.stringify(data.settleProductlist);
        let params = { ...userInfo,source_equipment:1,loadingdate,car_id,receivable_sum,paid_sum,foregift_sum,unpaid_sum,small_change_sum,distribution_sum,favourable_sum };
        params.settleProductlist = settleProductlistJSON;
        this.setState({ showSpinner: true })
        FetchManger.postUri('mobileServiceManager/balanceAccouts/addBalanceAccouts.page', params).then((responseData) => {
            this.setState({ showSpinner: false })
            Toast.show(responseData.msg)
            if (responseData.status === '0' || responseData.status === 0) {
                InteractionManager.runAfterInteractions(() => {
                    this.loadDataAction(this.state.loadingdate, this.state.car);
                    const navigationAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' }),
                        ]
                    })
                    navigation.dispatch(navigationAction)
                });
            }
        }).catch((error) => {
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }

    onSurePress() {
        Alert.alert('','确定保存日结单?',
            [
                { text: '确定', onPress: this.onSave },
                { text: '取消', onPress: () => console.log('Cancel Pressed!') }
            ]
        )
    }

    loadDataAction(loadingdate, car) {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;
        let car_id = car.carbaseinfo_id
        this.setState({ loadingdate, car, loading: car_id })
        if (car_id) {
            let params = { token, user_id, organization_id, loadingdate, car_id };
            FetchManger.getUri('/mobileServiceManager/balanceAccouts/getSettleBills.page', params).then((responseData) => {
                this.setState({ loading: false })
                Toast.show(responseData.msg)
                if (responseData.status === '0' || responseData.status === 0) {

                    this.setState({ data: responseData.data })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                Toast.show('获取失败')
            })
        }
    }

    _renderItem(item, index) {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`} >
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 130 }}>
                        <ImageView style={{ width: 90, height: 100, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.image }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 34, paddingLeft: 10, marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{item.product_name}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666', width: 110 }}>{'总提货'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.totalLoading_count ? item.totalLoading_count : 0}`}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666', width: 110 }}>{'余货/卸货'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.remain_count ? item.remain_count : 0}` + '/' + `${item.unLoading_count ? item.unLoading_count : 0}`}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666', width: 110 }}>{'销售/赠送'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.saler_count ? item.saler_count : 0}` + '/' + `${item.gift_count ? item.gift_count : 0}`}</Text>
                        </View>
                        <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666', width: 110 }}>{'价格/押金/金额'}</Text>
                            <Text style={{ color: '#f80000' }}>{`￥${item.product_price ? item.product_price : 0}` + '/' + `￥${item.product_foregift ? item.product_foregift : 0}` + '/' + `￥${item.total_sum ? item.total_sum : 0}`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>)
    }


    render() {
        let addLadingbillsProduct = {};
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 18, backgroundColor: '#f2f2f2' }} ></View>
                <TouchableOpacity onPress={this._selectCar}>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 54, justifyContent: 'center', alignItems: 'center' }}>
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
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 54, justifyContent: 'center', alignItems: 'center' }}>
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
                        onDateChange={(date) => { this._selectByDate(date) }}
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
                <View style={{ height: 40, paddingLeft: 12, backgroundColor: '#f2f2f2', justifyContent: 'center' }} >
                    <Text style={{ color: '#999' }}>{'结算产品信息'}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6' }} />
                {
                    this.state.loading ?
                        <LoadingView /> :
                        (this.state.data.settleProductlist.length == 0 ?
                            <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                <Text> 暂无数据</Text>
                            </View>
                            :
                            <ListView
                                dataSource={dataSource.cloneWithRows(this.state.data.settleProductlist)}
                                renderRow={this._renderItem} />
                        )

                }
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                {
                    this.state.data.settleProductlist.length > 0 ?
                        <View style={{paddingLeft:8 , height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'应收金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.receivable_sum}`}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'未收金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.unpaid_sum}`}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'铺货金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.distribution_sum ? this.state.data.distribution_sum : 0}`}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'实收金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.paid_sum}`}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'抹零金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.small_change_sum}`}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'优惠金额：'}</Text>
                                    <Text style={{ color: '#f80000' }}>{`${this.state.data.favourable_sum ? this.state.data.favourable_sum : 0}`}</Text>
                                </View>
                            </View>
                            <TouchableHighlight onPress={this.onSurePress.bind(this)}>
                                <View style={{ width: 80, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'确定'}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        : null
                }
                <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default AddBalanceAccoutsPage;

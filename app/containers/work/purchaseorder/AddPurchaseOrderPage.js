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
    Alert,
    ScrollView,
    ActivityIndicator,
    Platform
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo, FetchManger } from 'react-native-go';
import * as DateUtils from '../../../utils/DateUtils'
import LoadingListView from '../../../components/LoadingListView'
import SearchBar from '../../../components/SearchBar';
import LadProductItem from './LadProductItem'
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';
import AddPurchaseEditeModel from './AddPurchaseEditeModel';
import ReturnGoodPopModel from './ReturnGoodPopModel'
import * as NumberUtils from '../../../utils/NumberUtils';

const WINDOW_WIDTH = Dimensions.get('window').width;

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let carWeight = '';
/**
 * 开订货单 产品列表
 */
class AddPurchaseOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onEidteCancelPress = this.onEidteCancelPress.bind(this);
        this.onEidteConfirmPress = this.onEidteConfirmPress.bind(this);
        this.savePopWindow = this.savePopWindow.bind(this);
        this.onClear = this.onClear.bind(this);
        this.getReturnGoodList = this.getReturnGoodList.bind(this)

        this.unpaid_total_sum = '';

        this.searchText = '';
        this.state = {
            loading: false,
            loadMore: false,
            good_list: [],
            total_sum:0,
            foregift_sum:0,
            paid_total_sum:0,
            modalVisible: false,
            showSpinner: false,
            modalPopVisible: false,
            editeModalVisible: false,
            selectItem: {},
            listData: []
        }

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getReturnGoodList(false)
        });
    }
    getReturnGoodList(loadMore, productName, page = 1) {

        const { params } = this.props.navigation.state;
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organizationId = LoginInfo.getUserInfo().organization_id;
        let reqParams = { token, user_id, organizationId };
        reqParams.page = page;
        reqParams.rows = 10;
        if (productName) {
            reqParams.product_name = productName;
        }
        if (loadMore) {
            this.setState({ loadMore: true });
        } else {
            this.setState({ loading: true });
        }

        InteractionManager.runAfterInteractions(() => {
            FetchManger.postUri('mobileServiceManager/purchaseOrders/queryListPurchaseOrdersProduct.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let good_list = data.good_list;
                    if (loadMore) {
                        if (good_list) {
                            let list = this.state.listData.concat(good_list);
                            this.setState({ listData: list, loadMore: false });
                        } else {
                            this.setState({ loadMore: false });
                        }

                    } else {
                        this.setState({ listData: good_list ? good_list : [], loading: false });
                    }
                } else {
                    if (loadMore) {
                        this.setState({ loadMore: false });
                    } else {
                        this.setState({ loading: false });
                    }
                    Toast.show(responseData.msg);
                }
            }).catch((error) => {
                console.log(error)
                if (loadMore) {
                    this.setState({ loadMore: false });
                } else {
                    this.setState({ loading: false });
                }
                Toast.show("网络错误");
            })
        });
    }
    onSearchAction(txt) {
        InteractionManager.runAfterInteractions(() => {
            this.getReturnGoodList(false, txt)
        });
    }

    _renderItem = (item, index) => {
        let selectItem = null;
        this.state.good_list.map((_item) => {
            if (_item.product_id === item.product_id) {
                selectItem = _item
            }
        })
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <LadProductItem item={item} selectItem={selectItem} />
            </TouchableOpacity>
        );
    }

    savePopWindow() {
        this.setState({ modalPopVisible: true })
    }

    //保存按钮
    onConfirmPress() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;


        let total_sum = this.state.total_sum;
        let foregift_sum = this.state.foregift_sum;
        let paid_total_sum = this.state.paid_total_sum;
        let unpaid_total_sum = NumberUtils.FloatSub(total_sum,paid_total_sum);
        if(paid_total_sum > total_sum){
            Toast.show('实收不能大于总计');
            return;
        }

        let sbParam = {
            token,
            user_id,
            organization_id,
            source_equipment: '1',
            customer_id: params.customer_id[1],
            order_date: params.order_date[0],
            saler_date: params.saler_date[0],
            total_sum,
            foregift_sum,
            paid_total_sum,
            unpaid_total_sum,
            good_list: JSON.stringify(this.state.good_list)
        };
        this.setState({showSpinner:true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.postUri('mobileServiceManager/purchaseOrders/toAddPurchaseOrders.page', sbParam).then((responseData) => {
                this.setState({ showSpinner: false });
                if (responseData.status === '0' || responseData.status === 0) {
                    const navigationAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' }),
                        ]
                    })
                    navigation.dispatch(navigationAction)
                    Toast.show('保存成功')
                } else {
                    Toast.show(responseData.msg);
                    this.setState({ showSpinner: false });
                }
            }).catch((error) => {
                console.log(error)
                this.setState({ showSpinner: false });
                Toast.show("网络错误");
            })
        });
       

    }
    onCancelPress() {
        this.setState({ modalVisible: false });
    }


    onClear() {
        this.setState({ good_list: [] });
    }
    onPopCancelPress() {
        this.setState({ modalVisible: false, modalPopVisible: false });
    }
    onEndAction() {

    }
    /**  pop end  */

    //加载更多
    onEndReached() {
        const start = this.state.listData.length;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                this.getReturnGoodList(true, this.searchText, start / 10 + 1)
            }
        });

    }
    //点击 编辑
    _rowOnPress(selectItem) {
        this.setState({ editeModalVisible: true, selectItem });
    }
    //修改数据取消
    onEidteCancelPress() {
        this.setState({ editeModalVisible: false });
    }
    //修改数量保存
    onEidteConfirmPress(item) {
        let listData = this.state.listData
        let good_list = this.state.good_list;
        let oldItem = null;
        for (let i = 0; i < good_list.length; i++) {
            if (item.product_id == good_list[i].product_id) {
                oldItem = good_list[i];
            }
        }
        item.product_price = NumberUtils.fc(item.product_price);
        if (oldItem) {
            oldItem.sale_quantity = item.sale_quantity
            oldItem.gifts_quantity = item.gifts_quantity
            oldItem.product_price = item.product_price
        } else {
            good_list.push(item)
        }

        let old_good_list = [];
        let totalSum = 0;
        let numberForegift = 0;
        good_list.map((_item) => {
            if ((_item.sale_quantity && _item.sale_quantity > 0) || (_item.gifts_quantity && _item.gifts_quantity > 0)) {

                let itemSum =  (_item.sale_quantity ? parseInt(_item.sale_quantity) : 0) + (_item.gifts_quantity ? parseInt(_item.gifts_quantity) : 0);
                let itemForegift = NumberUtils.FloatMul(_item.product_foregift, itemSum);
                let itemCarsh = NumberUtils.FloatAdd(NumberUtils.FloatMul(_item.product_price, _item.sale_quantity), itemForegift);
                _item.product_sum = itemCarsh;
                totalSum += _item.product_sum;
                numberForegift = NumberUtils.FloatAdd(itemForegift, numberForegift);
                old_good_list.push(_item);
            }
        })

        this.setState({ good_list: old_good_list,total_sum:totalSum,foregift_sum:numberForegift, editeModalVisible: false });
    }

    render() {
        let num = 0;
        let numberCarsh = 0;
        let numberForegift = 0;
        this.state.good_list.map((item) => {
            if ((item.sale_quantity && item.sale_quantity > 0) || (item.gifts_quantity && item.gifts_quantity > 0)) {
                let itemSum =  (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0);
                let itemForegift = NumberUtils.FloatMul(item.product_foregift, itemSum);
                let itemCarsh = NumberUtils.FloatAdd(NumberUtils.FloatMul(item.product_price, item.sale_quantity), itemForegift);
                num += itemSum;
                numberCarsh = NumberUtils.FloatAdd(numberCarsh, itemCarsh);
                numberForegift = NumberUtils.FloatAdd(itemForegift, numberForegift);

            }
        })
        numberCarsh = NumberUtils.fc(numberCarsh,numberForegift);

        this.numberCarsh = numberCarsh;
        this.foregift_sum = numberForegift;

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <SearchBar
                    onSearchChange={(text) => {
                        this.searchText = text.nativeEvent ? text.nativeEvent.text : text;
                        if (text && text.length > 0) {
                            this.onSearchAction(text);
                        }
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onClose={() => {
                        this.onSearchAction();
                    }}
                    placeholder={'请输入产品拼音查询'}
                    autoCorrect={false}
                    padding={8}
                    returnKeyType={'search'}
                />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                {
                    this.state.loading ?
                        <LoadingView /> :
                        (!this.state.listData || this.state.listData.length == 0 ?
                            <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                <Text> 暂无数据</Text>
                            </View>
                            :
                            <ListView
                                dataSource={dataSource.cloneWithRows(this.state.listData)}
                                renderRow={this._renderItem}
                                onEndReached={this.onEndReached}
                                onEndReachedThreshold={38}
                                renderFooter={() =>
                                    this.state.loadMore ? <View style={{
                                        height: 44,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white'
                                    }}>
                                        <ActivityIndicator
                                            size="large"
                                            color="#118cd7"
                                        />
                                    </View> : null}
                            />
                        )

                }
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ width: WINDOW_WIDTH, height: 30, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ marginRight: 8, marginLeft: 16, textAlign: 'right', }}>实收(元):</Text>
                    <TextInput style={{ width: 100, marginTop: 4, height: 25, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                        underlineColorAndroid={'transparent'}
                        value={this.state.paid_total_sum + ''}
                        keyboardType={'numeric'}
                        defaultValue={'0'}
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
                    <View style={{ flex: 1 }} />
                </View>
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this.savePopWindow.bind(this)}>
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
                    <View>
                        <Text style={{ color: '#999' }}>总计金额:￥{numberCarsh + '元'}</Text>
                        <Text style={{ color: '#999' }}>其中押金:￥{numberForegift + '元'}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    {
                        num > 0 ?
                            <TouchableHighlight onPress={this.onConfirmPress.bind(this)}>
                                <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'保存订单'}</Text>
                                </View>
                            </TouchableHighlight> : null
                    }
                </View>
                {
                    Platform.OS === 'ios' ?
                        <KeyboardSpacer /> : null
                }
                <AddPurchaseEditeModel modalVisible={this.state.editeModalVisible} onCancelPress={this.onEidteCancelPress} item={this.state.selectItem} chooseList={this.state.good_list} onConfirmPress={this.onEidteConfirmPress} />
                <ReturnGoodPopModel onClear={this.onClear} onEndAction={this.onEndAction.bind(this)} chooseList={this.state.good_list} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} />
                <View><Spinner visible={this.state.showSpinner} textContent={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default AddPurchaseOrderPage;

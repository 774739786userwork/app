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
    ActivityIndicator
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import LadProductItem from './components/LadProductItem'
import SaveModel from './components/SaveModel'
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { NavigationActions } from 'react-navigation'
import AddLadingbillPopModel from './AddLadingbillPopModel'
import AddLadingbillsEditeModel from './components/AddLadingbillsEditeModel'
const WINDOW_WIDTH = Dimensions.get('window').width;

import * as NumberUtils from '../../utils/NumberUtils'


const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let carWeight = '';
/**
 * 提货单 产品列表
 * 
 * 
 * 
loading_quantity:3
product_id:100064
product_name:"瓷砖包角线（白色）"
product_total_count:0
product_weight:0
purchaseOrderId:0
purchase_count:0
real_loading_count:3
remain_count:0
specifications:"20根/捆"


name:"瓷砖包角线（白色）"
product_total_count:"4"
product_weight:"0.2"
purchase_count:"0"
quantity:"4"
remain_count:"0"
specifications:"20根/捆"
unit:"根"

 */
class AddLadingbillsProductPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.onUpdateGoogs = this.onUpdateGoogs.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onEidteCancelPress = this.onEidteCancelPress.bind(this);
        this.onEidteConfirmPress = this.onEidteConfirmPress.bind(this);
        this.savePopWindow = this.savePopWindow.bind(this);
        this._onCarPress = this._onCarPress.bind(this);
        this.onClear = this.onClear.bind(this);
        this.searchText = '';
        
        const { params } = this.props.navigation.state;
        let oldList = params.goodsList;
        
        let good_list = [];
        if(oldList){
            oldList.map((item)=>{
                //todo  字段转换
                let oldGoodItem = {}
                oldGoodItem.product_id = item.product_id
                oldGoodItem.product_name = item.name
                oldGoodItem.loading_quantity = item.quantity
                if(item.purchaseOrderId){
                    oldGoodItem.purchaseOrderId = item.purchaseOrderId
                }
                oldGoodItem.purchase_count = item.purchase_count
                oldGoodItem.remain_count = item.remain_count
                oldGoodItem.product_weight = item.product_weight
                oldGoodItem.specifications = item.specifications
                oldGoodItem.housestock = item.housestock
                oldGoodItem.real_loading_count = item.product_total_count
                good_list.push(oldGoodItem);
            });
        }
        let totalWeight = 0;
        let totalNum = 0;
       
        if (good_list) {
            good_list.map((a) => {
                let itemWeight  = NumberUtils.FloatMul(a.product_weight, a.loading_quantity);

                totalWeight = NumberUtils.FloatAdd(totalWeight,itemWeight);
                totalNum = NumberUtils.FloatAdd(totalNum,a.loading_quantity);
            })
        }

        this.state = {
            good_list: good_list ? good_list : [],
            totalNum: totalNum,
            totalWeight: totalWeight,
            modalVisible: false,
            showSaving: false,
            modalPopVisible: false,
            editeModalVisible: false,
            selectItem: {},
            listData: [],
        }

    }
    componentWillReceiveProps(nextProps) {
        const { addLadingbillsProduct } = nextProps;
        const { navigation } = this.props;

        if (addLadingbillsProduct.errMsg) {
            this.setState({showSaving: false})
            Toast.show(addLadingbillsProduct.errMsg);
        } else if (!addLadingbillsProduct.saving && addLadingbillsProduct.seccued) {
            if (this.state.good_list.length > 0) {
                this.setState({
                    showSaving: false,
                    good_list: []
                })
                Toast.show('保存成功');
                InteractionManager.runAfterInteractions(() => {
                    const navigationAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' }),
                        ]
                    })
                    navigation.dispatch(navigationAction)
                });
            }
        }

        this.setState({ listData: addLadingbillsProduct.listData })
    }
    componentDidMount() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        
        let car_id = params.car_id[1];
        carWeight = params.car_id[2];

        InteractionManager.runAfterInteractions(() => {
            action.addLadingbillsProduct(car_id);
        });
    }
    onSearchAction(txt) {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        let car_id = params.car_id[1]
        InteractionManager.runAfterInteractions(() => {
            action.addLadingbillsProduct(car_id,txt);
        });
    }
    onUpdateGoogs(item) {
        let good_list = this.state.good_list;
        let oldItem = null;
        for (let i = 0; i < good_list.length; i++) {
            if (item.product_id == good_list[i].product_id) {
                oldItem = good_list[i];
            }
        }
        if (oldItem) {
            oldItem.real_loading_count = item.real_loading_count
            oldItem.loading_quantity = NumberUtils.FloatAdd(item.real_loading_count, item.remain_count);
        } else {
            item.loading_quantity =NumberUtils.FloatAdd(item.real_loading_count, item.remain_count);
            good_list.push(item)
        }
        let totalWeight = 0;
        let totalNum = 0;
        let goodsList = [];
        if (good_list) {
            good_list.map((a) => {
                if(a.real_loading_count > 0){
                    goodsList.push(a);
                    let itemWeight  = NumberUtils.FloatMul(a.product_weight, a.loading_quantity);
                    totalWeight = NumberUtils.FloatAdd(totalWeight,itemWeight);
                    totalNum = NumberUtils.FloatAdd(totalNum,a.loading_quantity);
                }
                
            })
        }
        this.setState({ good_list : goodsList, totalNum, totalWeight });
    }
    _renderItem = (item, index) => {
        let good_list = this.state.good_list;
        if (good_list) {
            good_list.map((a) => {
                if (item.product_id == a.product_id) {
                    item.real_loading_count = a.real_loading_count
                    item.loading_quantity = a.loading_quantity //a.real_loading_count + a.remain_count
                    item.purchaseOrderId = a.purchaseOrderId
                    item.purchase_count = a.purchase_count
                    item.remain_count = a.remain_count
                    item.housestock = a.housestock
                }
            })
        }
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <LadProductItem item={item} onUpdate={this.onUpdateGoogs} />
            </TouchableOpacity>
        );
    }
    /**
     * 提交数据
     * 
     * "loadingbill_date":"2017-05-10",
    "car_id":"104",
    "car_number":"江铃全顺-云AOXY58",
    "store_house_id":"2",
    "organization_id":"100002",
    "total_quantity":"1000",
    "total_weight":"500kg",
    "source_equipment":"1",
     */
    _onItemPress() {
        
        if(this.state.totalWeight > carWeight){
            Alert.alert('你已超出该车的实际载重量','确认继续提货?',
                [
                    { text: '确定', onPress: this.savePopWindow },
                    { text: '取消', onPress: () => console.log('Cancel Pressed!') }
                ]
            )
        }else{
            this.setState({ modalVisible: true })
        }
    }

    savePopWindow(){
        this.setState({ modalVisible: true })
    }
    onConfirmPress() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;

        let sbParam = {
            source_equipment: '1',
            loadingdate: params.loadingbill_date[0],
            car_number: params.car_id[0],
            car_id: params.car_id[1],
            store_house_id: params.storehouse_id[1],
            porters_id:params.upEmployeeIds[0],
            total_quantity: this.state.totalNum,
            total_weight: this.state.totalWeight + 'kg',
            good_list: JSON.stringify(this.state.good_list)
        };
        
        if(params.loading_id){
            sbParam.loading_id = params.loading_id;
        }
        InteractionManager.runAfterInteractions(() => {
            action.saveLadingbillsProduct(sbParam);
        });
        this.setState({ modalVisible: false, showSaving: true });

    }
    onCancelPress() {
        this.setState({ modalVisible: false });
    }
    /*****  pop start * */
    _onCarPress() {
        this.setState({
            modalPopVisible: true
        })

    }

    onClear() {
        this.state.listData.map((item) => {
            item.real_loading_count = 0
            item.loading_quantity = 0
        })
        this.setState({ good_list: [], totalNum: 0, totalWeight: 0 });
    }
    onPopCancelPress() {
        this.setState({
            modalPopVisible: false
        })
    }
    /**  pop end  */

    //加载更多
    onEndReached() {
        const { action, addLadingbillsProduct } = this.props;
        const start = addLadingbillsProduct.listData.length;
        const { params } = this.props.navigation.state;
        let car_id = params.car_id[1]
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.addLadingbillsProduct(car_id,this.searchText, start);
            }
        });
    }
    _rowOnPress(selectItem) {
        this.setState({ editeModalVisible: true, selectItem });
    }
    onEidteCancelPress() {
        this.setState({ editeModalVisible: false });
    }
    onEidteConfirmPress(item) {
        let good_list = this.state.good_list;
        let oldItem = null;
        for (let i = 0; i < good_list.length; i++) {
            if (item.product_id == good_list[i].product_id) {
                oldItem = good_list[i];
            }
        }
        if (oldItem) {
            oldItem.real_loading_count = item.real_loading_count
            oldItem.loading_quantity = NumberUtils.FloatAdd(item.real_loading_count, item.remain_count);
        } else {
            item.loading_quantity = NumberUtils.FloatAdd(item.real_loading_count, item.remain_count);
            good_list.push(item)
        }
        let totalWeight = 0;
        let totalNum = 0;
        if (good_list) {
            good_list.map((a) => {
                let itemWeight  = NumberUtils.FloatMul(a.product_weight, a.loading_quantity);
                
                totalWeight = NumberUtils.FloatAdd(totalWeight,itemWeight);
                totalNum = NumberUtils.FloatAdd(totalNum,a.loading_quantity);
            })
        }
        this.setState({ good_list, totalNum, totalWeight, editeModalVisible: false });
    }


    render() {
        const { params } = this.props.navigation.state;
        const { addLadingbillsProduct } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.car_id[0]}`}</Text>
                        <View style={{marginLeft:20}}/>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.storehouse_id[0]}`}</Text>
                        <View style={{marginLeft:20}}/>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.upEmployeeIds[1]}`}</Text>
                    </View>
                </View>
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
                    addLadingbillsProduct.loading ?
                        <LoadingView /> :
                        (this.state.listData.length == 0 ?
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
                                    addLadingbillsProduct.loadMore ? <View style={{
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
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this._onCarPress.bind(this)}>
                        <View style={{ width: 50, height: 50, padding: 6, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                            <Iconfont fontFamily={'OAIndexIcon'}
                                icon={'e6b5'} // 图标
                                iconColor={'#999'}
                                iconSize={30}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'总数量：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${this.state.totalNum}`}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'总重量：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${this.state.totalWeight}KG`}</Text>
                        </View>
                    </View>
                    {
                        this.state.good_list.length > 0 ?
                            <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                                <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'保存'}</Text>
                                </View>
                            </TouchableHighlight> : null
                    }
                </View>
                <View><Spinner visible={this.state.showSaving} textContent={'提交中,请稍后...'} /></View>
                <SaveModel modalVisible={this.state.modalVisible} onConfirmPress={this.onConfirmPress} onCancelPress={this.onCancelPress} />
                <AddLadingbillPopModel onClear={this.onClear} chooseList={this.state.good_list} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} />
                <AddLadingbillsEditeModel modalVisible={this.state.editeModalVisible} onCancelPress={this.onEidteCancelPress} item={this.state.selectItem} onConfirmPress={this.onEidteConfirmPress} />
                
            </View >
        );
    }
}

export default AddLadingbillsProductPage;

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
import ImageView from '../../components/ImageView'
import * as NumberUtils from '../../utils/NumberUtils'
const ic_empty = require('../../imgs/ic_empty.png');

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
        this.initUpdate = this.initUpdate.bind(this);

        this.searchText = '';

        const { params } = this.props.navigation.state;
        let oldList = params.goodsList;

        let good_list = [];
        if (oldList) {
            oldList.map((item) => {
                //todo  字段转换
                let oldGoodItem = {}
                oldGoodItem.product_id = item.product_id
                oldGoodItem.product_name = item.name
                oldGoodItem.loading_quantity = item.product_total_count
                if (item.purchaseOrderId) {
                    oldGoodItem.purchaseOrderId = item.purchaseOrderId
                }
                oldGoodItem.purchase_count = item.purchase_count
                oldGoodItem.remain_count = item.remain_count
                oldGoodItem.product_weight = item.product_weight
                oldGoodItem.specifications = item.specifications
                oldGoodItem.housestock = item.housestock
                oldGoodItem.real_loading_count = item.quantity
                good_list.push(oldGoodItem);
            });
        }
        let totalWeight = 0;
        let totalNum = 0;

        if (good_list) {
            good_list.map((a) => {
                let itemWeight = NumberUtils.FloatMul(a.product_weight, a.loading_quantity);

                totalWeight = NumberUtils.FloatAdd(totalWeight, itemWeight);
                totalNum = NumberUtils.FloatAdd(totalNum, a.loading_quantity);
            })
        }

        this.state = {
            good_list: good_list ? good_list : [],
            itemListData: [],
            totalNum: totalNum,
            totalWeight: totalWeight,
            modalVisible: false,
            showSaving: false,
            modalPopVisible: false,
            editeModalVisible: false,
            selectItem: {},
            listData: [],
            error: false
        }

    }
    componentWillReceiveProps(nextProps) {
        const { addLadingbillsProduct } = nextProps;
        const { navigation } = this.props;

        if (addLadingbillsProduct.errMsg) {
            this.setState({ showSaving: false })
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
        // this.setState({ listData: addLadingbillsProduct.listData })
        this.initUpdate(addLadingbillsProduct.listData);
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
            action.addLadingbillsProduct(car_id, txt);
        });
    }
    initUpdate(listData) {
        let totalWeight = 0;
        let totalNum = 0;
        let goodsList = this.state.good_list;
        let itemListData = undefined;
        if (listData) {
            for (var i = 0; i < listData.length; i++) {
                let listitem = listData[i];
                if (!itemListData) {
                    itemListData = listitem.appProduct;
                }
                listitem.appProduct.map((a) => {
                    if (a.remain_count > 0) {
                        a.real_loading_count = -a.remain_count;
                        let isContaint = false;
                        goodsList.map((item) => {
                            if (item.product_id == a.product_id) {
                                isContaint = true;
                            }
                        });
                        if (!isContaint) {
                            goodsList.push(a);
                        }
                    }
                })
            }
        }
        this.setState({ listData, itemListData, good_list: goodsList });
    }
    //this.setState({ listData: addLadingbillsProduct.listData })

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
        item.loading_quantity = item.loading_quantity ? item.loading_quantity : 0;
        let url = global.baseUrl + item.image;
        
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', marginLeft: 5, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <Image source={{ uri: url }} style={{ width: 70, height: 70, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }}/>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'仓库库存：'}</Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{`${item.housestock}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.specifications}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'余货：'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.remain_count}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'订单数量：'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.purchase_count}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'总数：'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.loading_quantity ? item.loading_quantity : 0}`}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>{'实提:'}</Text>
                                    <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.real_loading_count ? item.real_loading_count : 0}`}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
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

        if (this.state.totalWeight > carWeight) {
            Alert.alert('你已超出该车的实际载重量', '确认继续提货?',
                [
                    { text: '确定', onPress: this.savePopWindow },
                    { text: '取消', onPress: () => console.log('Cancel Pressed!') }
                ]
            )
        } else {
            this.setState({ modalVisible: true })
        }
    }

    savePopWindow() {
        this.setState({ modalVisible: true })
    }
    onConfirmPress() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;

        let upEmployeeIds = '';
        if (params.upEmployeeIds) {
            upEmployeeIds = params.upEmployeeIds[0]
        }
        let sbParam = {
            source_equipment: '1',
            loadingdate: params.loadingbill_date[0],
            car_number: params.car_id[0],
            car_id: params.car_id[1],
            store_house_id: params.storehouse_id[1],
            porters_id: upEmployeeIds,
            total_quantity: this.state.totalNum,
            total_weight: this.state.totalWeight + 'kg',
            good_list: JSON.stringify(this.state.good_list)
        };

        if (params.loading_id) {
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
        let listData = this.state.listData;

        for (var i = 0; i < listData.length; i++) {
            let listitem = listData[i];
            listitem.appProduct.map((a) => {
                a.real_loading_count = 0
                a.loading_quantity = 0
            });
        }

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
                action.addLadingbillsProduct(car_id, this.searchText, start);
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
            oldItem.loading_quantity = item.loading_quantity;
        } else {
            good_list.push(item)
        }
        let totalWeight = 0;
        let totalNum = 0;
        let goodsList = [];
        if (good_list) {
            good_list.map((a) => {
                if (a.real_loading_count > 0 || a.remain_count > 0) {
                    goodsList.push(a);

                    let loading_quantity = a.loading_quantity ? parseInt(a.loading_quantity) : 0;

                    let itemWeight = NumberUtils.FloatMul(a.product_weight, loading_quantity);
                    totalWeight = NumberUtils.FloatAdd(totalWeight, itemWeight);
                    totalNum = totalNum + loading_quantity;
                }
            })
        }
        this.setState({ good_list: goodsList, totalNum, totalWeight, editeModalVisible: false });
    }


    render() {
        const { params } = this.props.navigation.state;
        const { addLadingbillsProduct } = this.props;
        let upEmployeeIds = '';
        if (params.upEmployeeIds) {
            upEmployeeIds = params.upEmployeeIds[1]
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.car_id[0]}`}</Text>
                        <View style={{ marginLeft: 20 }} />
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.storehouse_id[0]}`}</Text>
                        <View style={{ marginLeft: 20 }} />
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${upEmployeeIds}`}</Text>
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
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                                <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                                    <LeftTabComponet
                                        data={this.state.listData}
                                        sectionAction={(item) => {
                                            let itemListData = item.appProduct;
                                            this.setState({ itemListData })
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
                                    <ListView
                                        enableEmptySections={true}
                                        dataSource={dataSource.cloneWithRows(this.state.itemListData)}
                                        renderRow={this._renderItem}
                                    />
                                </View>
                            </View>
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
                <AddLadingbillPopModel onClear={this.onClear} chooseList={this.state.good_list} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} onConfirmPress={this.onEidteConfirmPress} />
                <AddLadingbillsEditeModel modalVisible={this.state.editeModalVisible} onCancelPress={this.onEidteCancelPress} item={this.state.selectItem} onConfirmPress={this.onEidteConfirmPress} />

            </View >
        );
    }
}

export default AddLadingbillsProductPage;



class LeftTabComponet extends React.Component {
    constructor(props) {
        super(props)
        this.renderSectionListItem = this.renderSectionListItem.bind(this);
        this.state = {
            preSelect: undefined
        }
        this.preSelect = undefined
    }
    sectionAction(item) {
        this.props.sectionAction && this.props.sectionAction(item)
        this.setState({ preSelect: item.productKindId })
    }
    renderSectionListItem(item) {
        let productKindId = item.productKindId;
        let preSelect = this.state.preSelect;
        if (!this.preSelect) {
            this.preSelect = productKindId
        }
        preSelect = preSelect ? preSelect : this.preSelect

        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${productKindId}`}>
            <View>
                <View style={{ width: 100, padding: 10, backgroundColor: preSelect != productKindId ? '#fff' : '#f9f9f9' }}>
                    <Text style={{ color: preSelect != productKindId ? '#333' : '#0081d4' }}>{item.series_name}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: 60, backgroundColor: '#f9f9f9' }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        return <ScrollView>
            {
                this.props.data.map((item) => this.renderSectionListItem(item))
            }
        </ScrollView>
    }
}
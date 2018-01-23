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
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, LoginInfo, FetchManger } from 'react-native-go';
import * as DateUtils from '../../../utils/DateUtils'
import LoadingListView from '../../../components/LoadingListView'
import SearchBar from '../../../components/SearchBar';
import LadProductItem from './LadProductItem'
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { NavigationActions } from 'react-navigation';
import EditeReturnNumModel from './EditeReturnNumModel';
import ReturnGoodPopModel from './ReturnGoodPopModel'
import * as NumberUtils from '../../../utils/NumberUtils';

const WINDOW_WIDTH = Dimensions.get('window').width;

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let carWeight = '';
/**
 * 开退货单 产品列表
 */
class ReturnEmptyGoodListPage extends React.Component {
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
        this.onClear = this.onClear.bind(this);
        this.getReturnGoodList = this.getReturnGoodList.bind(this)
        this.searchText = '';
        this.state = {
            loading: false,
            loadMore: false,
            good_list: [],
            totalNum: 0,
            totalWeight: 0,
            modalVisible: false,
            showSaving: false,
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
        reqParams.returnType = 1;
        reqParams.customerId = params.contactId[1];
        if (productName) {
            reqParams.productName = productName;
        }
        if (loadMore) {
            this.setState({ loadMore: true });
        } else {
            this.setState({ loading: true });
        }

        InteractionManager.runAfterInteractions(() => {
            FetchManger.postUri('mobileServiceManager/returnmanage/getReturnGoodList.page', reqParams).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    if (loadMore) {
                        if(data){
                            let list = this.state.listData.concat(data);
                            this.setState({ listData: list, loadMore: false });
                        }else{
                            this.setState({ loadMore: false });
                        }
                       
                    } else {
                        this.setState({ listData: data ? data : [], loading: false });
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
        let selectItem = {};
        this.state.good_list.map((_item) => {
            if (_item.productId === item.productId) {
                selectItem = _item
            }
        })
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <LadProductItem item={item} selectItem={selectItem}/>
            </TouchableOpacity>
        );
    }
    //保存按钮
    _onItemPress() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        params.good_list = this.state.good_list
        params.returnType = 1;
        navigate('ReturnGoodComfirm', { ...params });
    }


    savePopWindow() {
        this.setState({ modalPopVisible: true })
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

            total_quantity: this.state.totalNum,
            total_weight: this.state.totalWeight + 'kg',
            good_list: JSON.stringify(this.state.good_list)
        };
        InteractionManager.runAfterInteractions(() => {
            action.saveLadingbillsProduct(sbParam);
        });
        this.setState({ modalVisible: false, showSaving: true });

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
            if (item.productId == good_list[i].productId) {
                oldItem = good_list[i];
            }
        }
        if (oldItem) {
            oldItem.returnQuantity = item.returnQuantity
            oldItem.realPrice = item.realPrice
        } else {
            good_list.push(item)
        }

        let old_good_list = [];
        good_list.map((_item)=>{
            if(_item.returnQuantity && _item.returnQuantity > 0){
                old_good_list.push(_item);
            }
        })

        this.setState({ good_list:old_good_list, editeModalVisible: false });
    }
    render() {
        let num = 0;
        let numberCarsh = 0;
        this.state.good_list.map((item) => {
            if (item.returnQuantity && item.returnQuantity > 0) {
                num += item.returnQuantity;
                let foregift = item.foregift ? item.foregift : 0;
                numberCarsh += NumberUtils.FloatMul(NumberUtils.FloatAdd(item.realPrice,foregift) , item.returnQuantity)
            }
        })
        numberCarsh = NumberUtils.fc(numberCarsh);

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
                    <Text style={{ color: '#f80000' }}>￥{numberCarsh + '元'}</Text>
                    <View style={{ flex: 1 }} />
                    {
                        num > 0 && numberCarsh > 0?
                            <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                                <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{'退货'}</Text>
                                </View>
                            </TouchableHighlight> : null
                    }
                </View>
                <EditeReturnNumModel modalVisible={this.state.editeModalVisible} onCancelPress={this.onEidteCancelPress} item={this.state.selectItem} chooseList={this.state.good_list} onConfirmPress={this.onEidteConfirmPress} />
                <ReturnGoodPopModel onClear={this.onClear} onEndAction={this.onEndAction.bind(this)} chooseList={this.state.good_list} modalVisible={this.state.modalPopVisible} onCancelPress={this.onPopCancelPress.bind(this)} />
            </View >
        );
    }
}

export default ReturnEmptyGoodListPage;

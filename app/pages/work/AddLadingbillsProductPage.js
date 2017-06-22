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
    InteractionManager,
    FlatList,
    Alert,
    ScrollView
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import LadProductItem from './components/LadProductItem'
import SaveModel from './components/SaveModel'
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { NavigationActions } from 'react-navigation'

const WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * 提货单 产品列表
 */
class AddLadingbillsProductPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.onUpdateGoogs = this.onUpdateGoogs.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.state = {
            good_list: [],
            totalNum: 0,
            totalWeight: 0,
            modalVisible: false,
            showSaving: false,
        }

    }
    componentWillReceiveProps(nextProps) {
        const { saveLadingbillsProduct } = nextProps;
        const { navigation } = this.props;

        if (saveLadingbillsProduct.errMsg) {
            Toast.show(saveLadingbillsProduct.errMsg);
        } else if (!saveLadingbillsProduct.saving && saveLadingbillsProduct.seccued) {
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
    }
    componentDidMount() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        InteractionManager.runAfterInteractions(() => {
            action.addLadingbillsProduct();
        });
    }
    onSearchAction(txt) {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        InteractionManager.runAfterInteractions(() => {
            action.addLadingbillsProduct(txt);
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
            oldItem.loading_quantity = item.real_loading_count + item.remain_count
        } else {
            item.loading_quantity = item.real_loading_count + item.remain_count
            good_list.push(item)
        }
        let totalWeight = 0;
        let totalNum = 0;
        if (good_list) {
            good_list.map((a) => {
                totalWeight += a.product_weight * a.real_loading_count;
                totalNum += a.real_loading_count;
            })
        }
        this.setState({ good_list, totalNum, totalWeight });
    }
    _renderItem = (item, index) => {
        let good_list = this.state.good_list;
        if (good_list) {
            good_list.map((a) => {
                if (item.product_id == a.product_id) {
                    item.real_loading_count = a.real_loading_count
                    item.loading_quantity = a.real_loading_count + a.remain_count
                }
            })
        }
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <LadProductItem item={item} onUpdate={this.onUpdateGoogs} />
            </View>
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
        this.setState({ modalVisible: true })

    }
    onConfirmPress() {

        this.setState({ modalVisible: false });
    }
    onCancelPress() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;

        let sbParam = {
            source_equipment: '1',
            loadingbill_date: params.loadingbill_date[0],
            car_number: params.car_id[0],
            car_id: params.car_id[1],
            store_house_id: params.storehouse_id[1],

            total_quantity: this.state.totalNum,
            total_weight: this.state.totalWeight + 'kg',
            good_list: JSON.stringify(this.state.good_list)
        };
        debugger
        InteractionManager.runAfterInteractions(() => {
            action.saveLadingbillsProduct(sbParam);
        });
        this.setState({ modalVisible: false, showSaving: true });
    }
    render() {
        const { params } = this.props.navigation.state;
        const { addLadingbillsProduct, saveLadingbillsProduct } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.car_id[0]}`}</Text>
                    </View>
                    <View style={{ height: 26, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.storehouse_id[0]}`}</Text>
                    </View>
                </View>
                <SearchBar
                    onSearchChange={(text) => {
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
                <ScrollView>
                    {
                        addLadingbillsProduct.loading ?
                            <LoadingView /> :
                            (addLadingbillsProduct.listData._cachedRowCount == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 暂无数据</Text>
                                </View>
                                :
                                <ListView
                                    dataSource={addLadingbillsProduct.listData}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                </ScrollView>

                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, padding: 6, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                        <Iconfont
                            icon={'e6b5'} // 图标
                            iconColor={'#999'}
                            iconSize={30}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'总数量：'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${this.state.totalNum}`}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'总质量：'}</Text>
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
                <SaveModel modalVisible={this.state.modalVisible} onConfirmPress={this.onCancelPress} onCancelPress={this.onCancelPress} />
            </View >
        );
    }
}

export default AddLadingbillsProductPage;

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
    Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import LadProductItem from './components/LadProductItem'
import SaveModel from './components/SaveModel'
import Spinner from 'react-native-loading-spinner-overlay';

const WINDOW_WIDTH = Dimensions.get('window').width;
const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

/**
 * 提货单 打印页面
 */
class SelectLadingbillsDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.loadingdate
        };
    };

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
            oldItem.product_total_count = item.real_loading_count + item.remain_count
        } else {
            item.product_total_count = item.real_loading_count + item.remain_count
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
                    item.product_total_count = a.real_loading_count + a.remain_count
                }
            })
        }
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <LadProductItem item={item} onUpdate={this.onUpdateGoogs} />
            </View>
        );
    }

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
        InteractionManager.runAfterInteractions(() => {
            action.saveLadingbillsProduct(sbParam);
        });
        this.setState({ modalVisible: false, showSaving: true });
    }
    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <ListView
                    enableEmptySections={true}
                    dataSource={dataSource.cloneWithRows(params.goodsList)}
                    renderRow={this._renderItem}
                />
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

export default SelectLadingbillsDetailPage;

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
    Modal,
    TouchableHighlight
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView,Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import EditeModel from './EditeModel'
const WINDOW_WIDTH = Dimensions.get('window').width;

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class GetCarstockProductListPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.state = { 
            modalVisible: false,
            selectItem:{},
            data:[]
        };
    }
    componentWillReceiveProps(nextProps) {
        const { getCarstockProductList } = nextProps;
        
        if (getCarstockProductList.errMsg) {
            Toast.show(getCarstockProductList.errMsg);
        }     
        this.setState({data:getCarstockProductList.result})
    }
   componentDidMount() {
        const { action} = this.props;
        InteractionManager.runAfterInteractions(() => {
           this.timer = setTimeout(
            () => 
            { 
                try {
                    const { action, year, month, day } =DatePickerAndroid.open({
                        // 要设置默认值为今天的话，使用`new Date()`即可。
                        // 下面显示的会是2020年5月25日。月份是从0开始算的。
                        date: new Date()
                    });
                    if (action !== DatePickerAndroid.dismissedAction) {
                        // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                        let ladingdate = `${year}-${month+1}-${day}`;   
                    }
                } catch ({ code, message }) {
                    console.warn('Cannot open date picker', message);
                }
            },
            500);
            action.getCarstockProductList(186,DateUtils.getYearMonthDay());
        });
    }

    _rowOnPress(selectItem) {
        this.setState({ modalVisible: true,selectItem });
    }
    //disburden_quantity 卸货数量
    //stock_quantity 余货数量
    _renderItem = (item, index) => {
        return (
            <TouchableHighlight
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                    <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'提货量：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.total_loading_quantity}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'规格：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.product_specifications}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'卸货：'}</Text>
                            <Text style={{ color: '#666' }}>{'0'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{'车余货：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.product_stock_quantity}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>);
    }
    _onItemPress() {

    }

    onConfirmPress(id,newCount) {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.getCarstockProductListDisburden(id,newCount);
        });
         this.setState({ modalVisible: false });
    }
    onCancelPress() {
         this.setState({ modalVisible: false });
    }
    render() {
        const { getCarstockProductList } = this.props;
        let list = getCarstockProductList.result ? this.state.data:[];
        list = list ? list:[]
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <EditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
                <LoadingListView
                    loading={getCarstockProductList.loading}
                    loadMore={getCarstockProductList.loadMore}
                    listData={dataSource.cloneWithRows(list)}
                    renderRowView={this._renderItem} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 100, height: 50, backgroundColor: '#d6d6d6', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{'余货打印'}</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={{ flex: 1 }} />
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{'卸货确认'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View >
        );
    }
}

export default GetCarstockProductListPage;

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
import { Iconfont, LoadingView,Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import EditeModel from './EditeModel'
const WINDOW_WIDTH = Dimensions.get('window').width;

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
let carName = '';
class GetCarstockProductListPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._rowOnPress = this._rowOnPress.bind(this);
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this._selectByDate = this._selectByDate.bind(this)
        this._selectCar = this._selectCar.bind(this)

        let today = GetDateStr(0);
        this.state = {
            modalVisible: false,
            loadingdate: today,
            car: {
                platenumber: '请选择车牌号'
            },
            selectItem:{},
            data: []
        }
    }
    componentWillReceiveProps(nextProps) {
        const { getCarstockProductList } = nextProps;
        
        if (getCarstockProductList.errMsg) {
            Toast.show(getCarstockProductList.errMsg);
        }     
        this.setState({data:getCarstockProductList.result})
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

    //选日期
    _selectByDate(dateValue) {
        this.state.loadingdate = dateValue;
        const { action} = this.props;
        action.getCarstockProductList(carId,dateValue);
    }

    //选车牌
    _selectCar() {
        const { action,navigation } = this.props;
        navigation.navigate('SelectCar', {
            selectCar: true, callback: (data) => {
                carId = data['carbaseinfo_id']
                this.state.car.platenumber = data['platenumber']
                action.getCarstockProductList(carId,this.state.loadingdate);
            }
        });
    }

    render() {
        const { getCarstockProductList } = this.props;
        let list = getCarstockProductList.result ? this.state.data:[];
        list = list ? list:[]
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ height: 10, backgroundColor: '#f2f2f2' }} ></View>
                <EditeModel modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} item={this.state.selectItem} onConfirmPress={this.onConfirmPress} />
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
                    <Text style={{ color: '#999' }}>{'余货产品信息'}</Text>
                </View>
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

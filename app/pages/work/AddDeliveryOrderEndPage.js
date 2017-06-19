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
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const ic_product = require('../../imgs/ic_product.png')

const WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * 送货单 结算
 */
class AddDeliveryOrderEndPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        const { params } = this.props.navigation.state;

        this.state = {
            chooseList: params.chooseList
        }
    }


    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`} >
                <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                        <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{item.name}</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={{ color: '#666', marginRight: 8, fontSize: 12 }}>{item.specifications ? item.specifications : ''}</Text>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{item.activity ? item.activity : ''}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'库存：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.stock}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'单价：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.price}`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'数量：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.sequence}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: 40, paddingRight: 12, backgroundColor: '#f9f9f9', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#999', marginRight: 12 }}>{`计量人`}</Text>
                    <TouchableHighlight style={{ borderColor: '#0081d4', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} onPress={this._onSelectUser.bind(this, item)}>
                        <View style={{ flexDirection: 'row', width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderColor: '#0081d4', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                            <Text style={{ color: '#0081d4' }}>{item.delivery_remember_person_name ?item.delivery_remember_person_name : `请选择`}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>)
    }
    _onSelectUser(item) {
        const { navigate } = this.props.navigation;
        navigate('SelectUser', {
            callback: (data) => {
                item.delivery_remember_person = data.id;
                item.delivery_remember_person_name = data.name;
                this.setState({chooseList:this.state.chooseList})
            }
        });
    }
    _rowOnPress(item) {

    }
    _onItemPress() {

    }
    renderFooter() {
        return (
            <View style={{ padding: 12, backgroundColor: '#fff9f9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableHighlight style={{ borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }} onPress={this._onItemPress.bind(this)}>
                            <View style={{ flexDirection: 'row', width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderColor: '#f80000', borderWidth: StyleSheet.hairlineWidth, borderRadius: 4 }}>
                                <Text style={{ color: '#f80000' }}>{`取消抹零`}</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={{ color: '#f80000' }}>{'￥:0.6'}</Text>
                    </View>
                    <View style={{ flex: 1, height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>实收(元):</Text>
                        <TextInput style={{ width: 100, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(price) => {
                            }}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 30, flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>优惠金额(元):</Text>
                        <TextInput style={{ width: 60, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(price) => {
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{`铺货总额`}</Text>
                        <Text style={{ color: '#666' }}>{'￥:0.6'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>{`共14件商品,总计300元,押金总计200元`}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Text style={{ color: '#f80000' }}>{`备注:`}</Text>
                </View>
            </View>)
    }

    render() {
        const { params } = this.props.navigation.state;
        const { addLadingbillsProduct, saveLadingbillsProduct } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contacts[0].name}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contacts[0].mobile1}`}</Text>
                    </View>
                    <View style={{ height: 26, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.address}`}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ flex: 1 }}>
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource.cloneWithRows(params.chooseList)}
                        renderRow={this._renderItem}
                        renderFooter={this.renderFooter.bind(this)}
                    />
                </View>
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <TouchableHighlight onPress={this._onItemPress.bind(this)}>
                        <View style={{ width: 160, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{'收款'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View >
        );
    }
}

export default AddDeliveryOrderEndPage;

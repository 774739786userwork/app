import React from 'react';
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
    Modal,
    TouchableHighlight,
    Platform
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import * as NumberUtils from '../../../utils/NumberUtils'
import { Iconfont, Toast } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;
import ImageView from '../../../components/ImageView'

export default class AddPurchaseEditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.updateSaleQuantity = this.updateSaleQuantity.bind(this)
        this.updateGiftsQuantity = this.updateGiftsQuantity.bind(this)
        let item = this.props.item;
        this.state = {
            modalVisible: this.props.modalVisible,
            sale_quantity: item.sale_quantity ? item.sale_quantity : 0,
            gifts_quantity: item.gifts_quantity ? item.gifts_quantity : 0,
            price: item.product_price,
        };
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        this.setState({
            modalVisible: nextProps.modalVisible,
            sale_quantity: item.sale_quantity ? item.sale_quantity : 0,
            gifts_quantity: item.gifts_quantity ? item.gifts_quantity : 0,
            price: item.product_price,
        });
    }

    updateSaleQuantity(sale_quantity) {
        if (sale_quantity < 0) {
            sale_quantity = 0;
        }
        this.setState({ sale_quantity });
    }
    updateGiftsQuantity(gifts_quantity) {
        if (gifts_quantity < 0) {
            gifts_quantity = 0;
        }
        this.setState({ gifts_quantity });
    }

    onConfirmPress() {
        let item = this.props.item;
        let foregift = item.foregift ? item.foregift : 0
        //产品销售量
        item.sale_quantity = parseInt(this.state.sale_quantity)
        //产品赠送量
        item.gifts_quantity = parseInt(this.state.gifts_quantity)
        //产品出售时单价
        item.product_price = NumberUtils.fc(this.state.price)

        this.props.onConfirmPress && this.props.onConfirmPress(item)
        this.setState({ modalVisible: false });
    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
   

    render() {
        let modelWidth = WINDOW_WIDTH - 40;
        let item = this.props.item;
        return (<Modal
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => { }}
            visible={this.state.modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{ backgroundColor: '#0081d4', height: 40, width: modelWidth, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#fff' }}>{`${item.product_name}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <ImageView style={{ width: 90, height: 90, marginTop: 12, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.product_image }} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{ marginTop: 12, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 40, marginRight: 8, textAlign: 'right', }}>单价:</Text>
                                <TextInput style={{ width: 100, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                    underlineColorAndroid={'transparent'}
                                    value={'' + this.state.price}
                                    keyboardType={'numeric'}
                                    selectTextOnFocus={true}
                                    defaultValue={'' + this.state.price}
                                    onChangeText={(price) => {
                                        price = price ? price : '0'
                                        var re = /^[0-9]+.?[0-9]*$/;
                                        if (re.test(price)) {
                                            this.setState({ price: price })
                                        } else {
                                            this.setState({ price: this.state.price })
                                        }
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 8, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>押金:</Text>
                                <Text style={{ marginLeft: 8, flex: 3, }}>{`￥${item.product_foregift}`}</Text>
                            </View>
                            <View style={{ height: 34, marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>销量:</Text>
                                <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 8, marginRight: 12 }} onPress={() => {
                                        let sale_quantity = this.state.sale_quantity - 1;
                                        this.updateSaleQuantity(sale_quantity);
                                        
                                    }}>
                                        <Iconfont
                                            icon={'e6ba'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26} />
                                    </TouchableOpacity>
                                    <TextInput style={{ width: 80, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                        underlineColorAndroid={'transparent'}
                                        value={'' + this.state.sale_quantity}
                                        defaultValue={'' + this.state.sale_quantity}
                                        keyboardType={'numeric'}
                                        selectTextOnFocus={true}
                                        onChangeText={(newCount) => {
                                            let num = parseInt(newCount);
                                            let sale_quantity = isNaN(num) ? 0 : num
                                            if (sale_quantity >= 0) {
                                                this.updateSaleQuantity(sale_quantity);
                                            }
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => {
                                        let sale_quantity = this.state.sale_quantity + 1;
                                        this.updateSaleQuantity(sale_quantity);

                                    }}>
                                        <Iconfont
                                            icon={'e6b9'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26}
                                        /></TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ height: 34, marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>赠送:</Text>
                                <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 8, marginRight: 12 }} onPress={() => {
                                        this.updateGiftsQuantity(this.state.gifts_quantity - 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6ba'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26} />
                                    </TouchableOpacity>
                                    <TextInput style={{ width: 80, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                        underlineColorAndroid={'transparent'}
                                        value={'' + this.state.gifts_quantity}
                                        defaultValue={'' + this.state.gifts_quantity}
                                        keyboardType={'numeric'}
                                        selectTextOnFocus={true}
                                        onChangeText={(newCount) => {
                                            let num = parseInt(newCount);
                                            let gifts_quantity = isNaN(num) ? 0 : num
                                            if (gifts_quantity >= 0) {
                                                this.updateGiftsQuantity(gifts_quantity);
                                            }
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => {
                                        let gifts_quantity = this.state.gifts_quantity + 1;
                                        this.updateGiftsQuantity(gifts_quantity);

                                    }}>
                                        <Iconfont
                                            icon={'e6b9'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26}
                                        /></TouchableOpacity>
                                </View>
                            </View>


                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 44, width: modelWidth, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity onPress={this.onCancelPress}>
                            <View style={{ height: 44, width: modelWidth / 2, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                        </TouchableOpacity>
                        <View style={{ width: StyleSheet.hairlineWidth, height: 44, backgroundColor: '#c4c4c4' }} />
                        <TouchableOpacity onPress={this.onConfirmPress}>
                            <View style={{ height: 44, width: modelWidth / 2, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fe6732' }}>{'确定'}</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    Platform.OS === 'ios' ?
                        <KeyboardSpacer /> : null
                }
            </View>
        </Modal>)
    }
}
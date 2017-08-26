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

export default class EditeReturnNumModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        let item = this.props.item;
        this.state = {
            modalVisible: this.props.modalVisible,
            returnQuantity: 0,
            realPrice: 0,
        };
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        let chooseList = nextProps.chooseList;

        let returnQuantity = item.returnQuantity ? item.returnQuantity : 0;
        let realPrice = item.realPrice;
        let selectItem = {};
        chooseList.map((_item) => {
            if (_item.productId === item.productId) {
                selectItem = _item
                returnQuantity = selectItem.returnQuantity ? selectItem.returnQuantity : 0;
                realPrice = selectItem.realPrice;
            }
        })

        this.setState({
            modalVisible: nextProps.modalVisible,
            returnQuantity: returnQuantity,
            realPrice: realPrice
        });
    }
    updateNewCount(count) {
        if (count < 0) {
            count = 0;
        }
        this.setState({ returnQuantity: count });
    }
    onConfirmPress() {
        let item = this.props.item;
        let newItem = { ...item };
        let newCount = parseInt(this.state.returnQuantity)
        newItem.returnQuantity = newCount;
        newItem.realPrice = this.state.realPrice
        this.props.onConfirmPress && this.props.onConfirmPress(newItem)
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
                        <Text style={{ color: '#fff' }}>{`${item.productName}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <ImageView style={{ width: 90, height: 90, marginTop: 12, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.productImage }} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{ marginTop: 4, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 80, textAlign: 'right', }}>实际价格:</Text>
                                <TextInput style={{ width: 100, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                    underlineColorAndroid={'transparent'}
                                    value={'' + this.state.realPrice}
                                    keyboardType={'numeric'}
                                    defaultValue={'' + this.state.realPrice}
                                    onChangeText={(realPrice) => {
                                        realPrice = realPrice ? realPrice : '0'
                                        var re = /^[0-9]+.?[0-9]*$/;
                                        if (re.test(realPrice)) {
                                            this.setState({ realPrice: realPrice })
                                        } else {
                                            this.setState({ realPrice: this.state.realPrice })
                                        }
                                    }}
                                />
                            </View>
                            <View style={{ height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 80, textAlign: 'right', }}>押金:</Text>
                                <Text style={{ marginLeft: 8, flex: 3, }}>{`${item.foregift}`}</Text>
                            </View>
                            <View style={{ height: 34, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Text style={{ width: 80, textAlign: 'right', }}>退货数:</Text>
                                <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 8, marginRight: 6 }} onPress={() => {
                                        this.updateNewCount(this.state.returnQuantity - 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6ba'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={22} />
                                    </TouchableOpacity>
                                    <TextInput style={{ width: 40, height: 26, fontSize: 14, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                        underlineColorAndroid={'transparent'}
                                        value={'' + this.state.returnQuantity}
                                        defaultValue={'' + this.state.returnQuantity}
                                        onChangeText={(newCount) => {
                                            let num = parseInt(newCount);
                                            this.updateNewCount(isNaN(num) ? 0 : num);
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
                                        this.updateNewCount(this.state.returnQuantity + 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6b9'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={22}
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
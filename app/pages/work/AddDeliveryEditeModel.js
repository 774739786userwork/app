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
    TouchableHighlight
} from 'react-native';

import { Iconfont } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;
const ic_product = require('../../imgs/ic_product.png')

export default class AddDeliveryEditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        let item = this.props.item;
        this.state = {
            modalVisible: this.props.modalVisible,
            count: item.stock,
            maxCount: item.stock,
            isSend: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        this.setState({
            modalVisible: nextProps.modalVisible,
            count: item.stock,
            maxCount: item.stock,
        });
    }

    updateNewCount(newCount) {

        if (newCount < 0) {
            newCount = 0;
        }
        if (newCount > this.state.maxCount) {
            newCount = this.state.maxCount;
        }
        this.setState({ count: newCount });
    }
    onConfirmPress() {
        let item = this.props.item;
        this.props.onConfirmPress && this.props.onConfirmPress(item.id, this.state.count)
        this.setState({ modalVisible: false });
    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
    onTypePress(isSend) {
        this.setState({ isSend });
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
                        <Text style={{ color: '#fff' }}>{`${item.name}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 44, width: modelWidth, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={this.onTypePress.bind(this, true)}>
                            <Iconfont
                                icon={this.state.isSend ? 'e662' : 'e663'} // 图标
                                iconColor={'#0081d4'}
                                label={'送货类型'}
                                iconPadding={8}
                                iconSize={22} />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#c4c4c4', width: StyleSheet.hairlineWidth, height: 44 }} />
                        <TouchableOpacity style={{ flex: 1 }} onPress={this.onTypePress.bind(this, false)}>
                            <Iconfont
                                icon={this.state.isSend ? 'e663' : 'e662'} // 图标
                                iconColor={'#0081d4'}
                                label={'铺货类型'}
                                iconPadding={8}
                                iconSize={22} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image style={{ width: 90, height: 90, marginTop: 12, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                            <View style={{ marginTop: 8, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'right', color: '#666' }}>库存:</Text>
                                <Text style={{ marginLeft: 8, color: '#666' }}>{`10`}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{ marginTop: 12, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 40, marginRight: 8, textAlign: 'right', }}>单价:</Text>
                                <TextInput style={{ width: 100, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                    underlineColorAndroid={'transparent'}
                                    value={'' + this.state.count}
                                    defaultValue={'' + this.state.count}
                                    onChangeText={(newCount) => {
                                        this.updateNewCount(parseInt(newCount));
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 8, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>押金:</Text>
                                <Text style={{ marginLeft: 8, flex: 3, color: '#f80000' }}>{`${item.stock}${item.unit}`}</Text>
                            </View>
                            <View style={{ height: 34, marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>销量:</Text>
                                <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 8, marginRight: 12 }} onPress={() => {
                                        this.updateNewCount(this.state.count - 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6ba'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26} />
                                    </TouchableOpacity>
                                    <TextInput style={{ width: 80, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                        underlineColorAndroid={'transparent'}
                                        value={'' + this.state.count}
                                        defaultValue={'' + this.state.count}
                                        onChangeText={(newCount) => {
                                            this.updateNewCount(parseInt(newCount));
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => {
                                        this.updateNewCount(this.state.count + 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6b9'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={26}
                                        /></TouchableOpacity>
                                </View>
                            </View>
                            {
                                this.state.isSend ?
                                    <View style={{ height: 34, marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Text style={{ width: 40, textAlign: 'right', }}>赠送:</Text>
                                        <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <TouchableOpacity style={{ marginLeft: 8, marginRight: 12 }} onPress={() => {
                                                this.updateNewCount(this.state.count - 1);
                                            }}>
                                                <Iconfont
                                                    icon={'e6ba'} // 图标
                                                    iconColor={'#0081d4'}
                                                    iconSize={26} />
                                            </TouchableOpacity>
                                            <TextInput style={{ width: 80, height: 30, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                                underlineColorAndroid={'transparent'}
                                                value={'' + this.state.count}
                                                defaultValue={'' + this.state.count}
                                                onChangeText={(newCount) => {
                                                    this.updateNewCount(parseInt(newCount));
                                                }}
                                            />
                                            <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => {
                                                this.updateNewCount(this.state.count + 1);
                                            }}>
                                                <Iconfont
                                                    icon={'e6b9'} // 图标
                                                    iconColor={'#0081d4'}
                                                    iconSize={26}
                                                /></TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    null
                            }

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
            </View>
        </Modal>)
    }
}
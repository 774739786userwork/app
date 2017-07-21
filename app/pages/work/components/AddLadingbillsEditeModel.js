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
import * as NumberUtils from '../../../utils/NumberUtils'
import { Iconfont, Toast } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;
import ImageView from '../../../components/ImageView'

export default class AddLadingbillsEditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        let item = this.props.item;
        this.state = {
            modalVisible: this.props.modalVisible,
            real_loading_count: 0
        };
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        this.setState({
            modalVisible: nextProps.modalVisible,
            real_loading_count:item.real_loading_count ? item.real_loading_count : 0
        });
    }
    updateNewCount(count) {
        if (count < 0) {
            count = 0;
        }
        this.setState({ real_loading_count: count });
    }
    onConfirmPress() {
        let item = this.props.item;
        item.real_loading_count = parseInt(this.state.real_loading_count)
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
                            <ImageView style={{ width: 90, height: 90, marginTop: 12, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.image }} />
                            <View style={{ marginTop: 8, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'right', color: '#666' }}>库存:</Text>
                                <Text style={{ marginLeft: 8, color: '#666' }}>{'' + item.housestock}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{ marginTop: 8, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>余货:</Text>
                                <Text style={{ marginLeft: 8, flex: 3, }}>{`${item.remain_count}`}</Text>
                            </View>
                            <View style={{ height: 34, marginTop: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Text style={{ width: 40, textAlign: 'right', }}>总数:</Text>
                                <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 8, marginRight: 6 }} onPress={() => {
                                        this.updateNewCount(this.state.real_loading_count - 1);
                                    }}>
                                        <Iconfont
                                            icon={'e6ba'} // 图标
                                            iconColor={'#0081d4'}
                                            iconSize={22} />
                                    </TouchableOpacity>
                                    <TextInput style={{ width: 40, height: 26, fontSize: 14, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                                        underlineColorAndroid={'transparent'}
                                        value={'' + this.state.real_loading_count}
                                        defaultValue={'' + this.state.real_loading_count}
                                        onChangeText={(newCount) => {
                                            let num = parseInt(newCount);
                                            this.updateNewCount(isNaN(num) ? 0 : num);
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
                                        this.updateNewCount(this.state.real_loading_count + 1);
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
            </View>
        </Modal>)
    }
}
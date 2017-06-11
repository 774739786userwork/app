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
export default class EditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        let item = this.props.item;
        this.state = {
            modalVisible: this.props.modalVisible,
            count: item.disburden_quantity,
            maxCount: item.stock,
        };
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        this.setState({
            modalVisible: nextProps.modalVisible,
            count: item.disburden_quantity,
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
        this.props.onConfirmPress && this.props.onConfirmPress(item.id,this.state.count)
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
            onRequestClose={() => {}}
            visible={this.state.modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', padding: 20,backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                <View style={{
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{ backgroundColor: '#0081d4', height: 36, width: modelWidth, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#fff' }}>{`${item.name}`}</Text>
                    </View>
                    <View style={{ marginTop: 12, height: 34, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 2, textAlign: 'right', }}>库存:</Text>
                        <Text style={{ marginLeft: 8, flex: 3, color: '#f80000' }}>{`${item.stock}${item.unit}`}</Text>
                    </View>
                    <View style={{ height: 34, marginBottom: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={{ flex: 2, textAlign: 'right', }}>卸货:</Text>
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
                                in
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
                    <View style={{ height: StyleSheet.hairlineWidth, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 36, width: modelWidth, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity onPress={this.onCancelPress}>
                            <View style={{ height: 36, width: modelWidth / 2, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                        </TouchableOpacity>
                        <View style={{ width: StyleSheet.hairlineWidth, height: 36, backgroundColor: '#c4c4c4' }} />
                        <TouchableOpacity onPress={this.onConfirmPress}>
                            <View style={{ height: 36, width: modelWidth / 2, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fe6732' }}>{'确定'}</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>)
    }
}
import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
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

import { Iconfont } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default class RemarkEditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.state = {
            modalVisible: this.props.modalVisible,
        };
        this.content = '';
    }
    componentWillReceiveProps(nextProps) {
        let item = nextProps.item;
        this.setState({
            modalVisible: nextProps.modalVisible,
        });
    }


    onConfirmPress() {
        this.props.onConfirmPress && this.props.onConfirmPress(this.content)
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
                        <Text style={{ color: '#fff' }}>{`写备注`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 100, width: modelWidth, justifyContent: 'center', alignItems: 'center', }}>
                        <TextInput style={{
                            backgroundColor: '#fff',
                            padding: 4,
                            height: 100,
                            width: modelWidth,
                        }}
                            placeholder={'请填写备注'}
                            defaultValue={this.props.content}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={'#999'}
                            multiline={true}
                            onChangeText={(content) => {
                                this.content = content
                            }}
                        />
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
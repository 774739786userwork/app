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
    Keyboard,
    TouchableHighlight,
    Platform
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Iconfont } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;

let radio_props = [
    { label: '不好用', value: 0 },
    { label: '不好卖', value: 1 },
    { label: '过期', value: 2 },
    { label: '质量问题 ', value: 3 },
    { label: '滞销 ', value: 4 }
];

export default class RemarkEditeModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.state = {
            modalVisible: this.props.modalVisible,
            isSelected: 0,
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
        let content = this.content;
        let selectContext = "";
        if(this.state.isSelected != -1){
            selectContext = radio_props[this.state.isSelected].label;
        }
        if((this.content && this.content.length > 0) || selectContext){
            let text = selectContext;
            if(this.content){
                text += "," + this.content;
            }
            this.props.onConfirmPress && this.props.onConfirmPress(text)
            alert(text)
            this.setState({ modalVisible: false });
        }else {
            Toast.show('请选择或填写原因!')
        }
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
                        <Text style={{ color: '#fff' }}>{`写退货原因`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <View style={{ flex: 1 }}>
                            <RadioButton
                                isSelected={this.state.isSelected === 0}
                                obj={radio_props[0]}
                                index={0}
                                buttonSize={14}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                labelColor={'#000'}
                                onPress={(value, index) => {
                                    if (this.state.isSelected === 0) {
                                        this.setState({ isSelected: -1 })
                                    } else {
                                        this.setState({ isSelected: 0 })
                                    }
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <RadioButton
                                isSelected={this.state.isSelected === 1}
                                obj={radio_props[1]}
                                index={1}
                                buttonSize={14}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                labelColor={'#000'}
                                onPress={(value, index) => {
                                    if (this.state.isSelected === 1) {
                                        this.setState({ isSelected: -1 })
                                    } else {
                                        this.setState({ isSelected: 1 })
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <RadioButton
                                isSelected={this.state.isSelected === 2}
                                obj={radio_props[2]}
                                index={2}
                                buttonSize={14}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                labelColor={'#000'}
                                onPress={(value, index) => {
                                    if (this.state.isSelected === 2) {
                                        this.setState({ isSelected: -1 })
                                    } else {
                                        this.setState({ isSelected: 2 })
                                    }
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <RadioButton
                                isSelected={this.state.isSelected === 3}
                                obj={radio_props[3]}
                                index={3}
                                buttonSize={14}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                labelColor={'#000'}
                                onPress={(value, index) => {
                                    if (this.state.isSelected === 3) {
                                        this.setState({ isSelected: -1 })
                                    } else {
                                        this.setState({ isSelected: 3 })
                                    }
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <RadioButton
                                isSelected={this.state.isSelected === 4}
                                obj={radio_props[4]}
                                index={3}
                                buttonSize={14}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                labelColor={'#000'}
                                onPress={(value, index) => {
                                    if (this.state.isSelected === 4) {
                                        this.setState({ isSelected: -1 })
                                    } else {
                                        this.setState({ isSelected: 4 })
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 100, width: modelWidth, justifyContent: 'center', alignItems: 'center', }}>
                        <TextInput style={{
                            backgroundColor: '#fff',
                            padding: 4,
                            height: 100,
                            width: modelWidth,
                        }}
                            placeholder={'请填写退货原因'}
                            defaultValue={this.props.content}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={'#999'}
                            multiline={true}
                            returnKeyType="done"
                            onChangeText={(content) => {
                                this.content = content
                            }}
                            onSubmitEditing={Keyboard.dismiss}
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
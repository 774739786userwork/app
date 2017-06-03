import React, { Component, } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    Alert,
    TouchableWithoutFeedback,
    Dimensions,
    ImageButton,
    TouchableOpacity
} from 'react-native';

import { Iconfont, LineView, Toast, Spinner } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default class ForgetPassWordPage extends React.Component {

    render() {
        return (<View style={{ flex: 1 }} >
            <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                <View style={{ height: 40, marginTop: 20 }}>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                    <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请输入您的原始密码'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={(username) => {

                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ height: 40 }}>
                    <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请输入您的新密码'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={(disability_code) => {

                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ marginTop: 20, height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ height: 40, }}>
                    <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请再次输入您的新密码'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(user_password) => {

                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ flexDirection: 'row', height: 48, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>密码为6-20位数字、字母组合，不含下划线</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    dismissKeyboard();
                }}
                    underlayColor={'#999'}
                    style={{ height: 44, width: WINDOW_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#0081d4', }}>完成</Text>
                </TouchableOpacity >
            </View >
            <View><Spinner visible={false} /></View>

        </View >);
    }
}

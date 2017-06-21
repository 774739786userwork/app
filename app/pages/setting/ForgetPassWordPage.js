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

import { Iconfont, LoginInfo, LineView, Toast, Spinner, FetchManger } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default class ForgetPassWordPage extends React.Component {
    constructor(props) {
        super(props)
        this.doAction = this.doAction.bind(this);
        this.userInfo = {}
        this.state = {
            showSpinner: false,
        }
    }
    doAction() {
        this.setState({ showSpinner: true })
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;

        this.userInfo.token = token;
        this.userInfo.user_id = user_id;
        const { navigation } = this.props;

        FetchManger.postUri('mobileServiceManager/user/updatePassword.page', this.userInfo).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                NavigationUtil.reset(this.props.navigation, 'Login');
                Toast.show('修改密码成功,请重新登录')
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            this.setState({ showSpinner: false })
            Toast.show('修改密码失败')
        })
    }

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
                        secureTextEntry={true}
                        onChangeText={(password) => {
                            this.userInfo.password = password;
                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ marginTop: 20, height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ height: 40 }}>
                    <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请输入您的新密码'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(newPassword) => {
                            this.userInfo.newPassword = newPassword;
                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ height: 40, }}>
                    <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请再次输入您的新密码'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(reNewPassword) => {
                            this.userInfo.reNewPassword = reNewPassword;
                        }}
                    />
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ flexDirection: 'row', height: 48, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>密码为6-20位数字、字母组合，不含下划线</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    dismissKeyboard();
                    if (!this.userInfo.password || !this.userInfo.newPassword) {
                        Toast.show('密码不能为空');
                        return
                    }
                    if (this.userInfo.newPassword != this.userInfo.reNewPassword) {
                        Toast.show('两次输入的密码不一致');
                        return
                    }
                    if (this.userInfo.newPassword.length < 6 || this.userInfo.newPassword.length > 20) {
                        Toast.show('密码的长度必须为6-20位');
                        return
                    }
                    let regStr = "^([A-Z]|[a-z]|[0-9]){6,20}$";
                    if (!this.userInfo.newPassword.match(regStr)) {
                        Toast.show('密码的只能包含数字或字母');
                        return
                    } else {
                        this.doAction()
                    }

                }}
                    underlayColor={'#999'}
                    style={{ height: 44, width: WINDOW_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#0081d4', }}>完成</Text>
                </TouchableOpacity >
            </View >
            <View><Spinner visible={this.state.showSpinner} /></View>

        </View >);
    }
}

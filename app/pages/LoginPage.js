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
    InteractionManager
} from 'react-native';
import { Iconfont, Toast, Spinner, LoginInfo } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';
import NavigationUtil from '../utils/NavigationUtil';

let userInfo = {};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#ffffff',
    },
});


class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.onRegister = this.onRegister.bind(this);
        this.onForgetPwd = this.onForgetPwd.bind(this);
        this.onIpSetting = this.onIpSetting.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { login } = nextProps;
        if (1 === login.code || '1' === login.code) {
            const { navigation } = this.props;
            InteractionManager.runAfterInteractions(() => {
                if (navigation.state.routeName === 'Login') {
                    navigation.navigate('Login4Msg', userInfo)
                }
            });
        } else if (login.errMsg) {
            Toast.show(login.errMsg);
        } else if (login.data) {
            let data = login.data;
            LoginInfo.setUserInfo(data);
            InteractionManager.runAfterInteractions(() => {
        //        NavigationUtil.reset(this.props.navigation, 'Home');
               NavigationUtil.reset(this.props.navigation, 'Analysis');
            });
        }
    }

    render() {
        const { action, login } = this.props;
        return (<Image style={styles.container} source={require('../imgs/bj.png')}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 4, flexDirection: 'column' }}>
                    <View style={{ flex: 2 }} />
                    <View style={{ alignItems: 'center', marginBottom: 60 }}>
                        <Image style={{ width: 120, height: 90, margin: 8, borderRadius: 0, }}
                            source={require('../imgs/login/logo.png')} />
                    </View>

                    <View style={{ marginBottom: 16, backgroundColor: 'transparent', elevation: 4 }}>
                        <View style={{ flexDirection: 'row', height: 48, alignItems: 'center' }}>
                            <View style={{ height: 48, width: 32, }}>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon='e60e'
                                    iconColor='#fff'
                                    iconSize={24}
                                />
                            </View>
                            <TextInput style={{ height: 48, color: '#ffffff', flex: 1, paddingLeft: 8 }}
                                placeholder={'请输入您的帐号'}
                                placeholderTextColor={'#fff'}
                                underlineColorAndroid={'transparent'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(user_name) => {
                                    userInfo.user_name = user_name;
                                }}
                            />
                        </View>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#fff' }} />
                        <View style={{ height: 8, backgroundColor: 'transparent' }} />
                        <View style={{ flexDirection: 'row', height: 48, alignItems: 'center' }}>
                            <View style={{ height: 48, width: 32, }}>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon='e692'
                                    iconColor='#fff'
                                    iconSize={24}
                                />
                            </View>
                            <TextInput style={{ height: 48, color: '#ffffff', flex: 1, paddingLeft: 8 }}
                                placeholder={'请输入您的密码'}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor={'#fff'}
                                secureTextEntry={true}
                                onChangeText={(user_password) => {
                                    userInfo.user_password = user_password;
                                }}
                            />
                        </View>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#fff' }} />

                        <View style={{ flexDirection: 'row', height: 22, backgroundColor: 'transparent', alignItems: 'center', opacity: 0 }}>
                            <TouchableHighlight /* onPress={this.onForgetPwd} underlayColor={'#999'} */ style={{ height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, color: 'white', }}>忘记密码？</Text>
                            </TouchableHighlight >
                        </View>
                    </View >
                    <View style={{ elevation: 4, backgroundColor: '#ffffff', borderRadius: 24 }}>
                        <TouchableHighlight onPress={
                            () => {
                                if (!userInfo.user_name) {
                                    Toast.show('请输入账号！'); return;
                                }
                                if (!userInfo.user_password) {
                                    Toast.show('请输入密码！'); return;
                                }
                                dismissKeyboard();
                                action.loginingActon(userInfo.user_name, userInfo.user_password);
                            }
                        }
                            underlayColor={'#ffffff'}
                            style={{ height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24 }}>
                            <Text style={{ fontSize: 22, color: '#2e74bc', }}>登录</Text>
                        </TouchableHighlight >
                    </View >
                    <View style={{ flex: 3 }} />
                </View>
                <View style={{ flex: 1, backgroundColor: 'transparent', opacity: 0 }} >
                    <TouchableHighlight onPress={this.onIpSetting} style={{ height: 22, marginTop: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>设置</Text>
                    </TouchableHighlight >
                </View>
            </View>
            <View><Spinner visible={login.loading} text={'登录中,请稍后...'} /></View>

        </Image >);
    }
    onIpSetting() {
        const { navigation } = this.props;
        navigation.navigate('SettingUrl')
    }
    onForgetPwd() {

    }
    onRegister() {

    }
}

export default LoginPage;
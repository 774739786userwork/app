/**
 */
import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    ScrollView,
    View,
    TouchableHighlight,
    Alert,
    InteractionManager
} from 'react-native';
import CountDownText from '../components/CountDownText';
import { Iconfont, Toast, Spinner, LoginInfo } from 'react-native-go';
import * as ValidateUtils from '../utils/ValidateUtils';
import dismissKeyboard from 'dismissKeyboard';
import NavigationUtil from '../utils/NavigationUtil';

let userInfo = {};
class Login4MsgPage extends React.Component {
    constructor(props) {
        super(props);
        this.sendMsg = this.sendMsg.bind(this);
        this.login = this.login.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { sendMsg } = nextProps;
        if (sendMsg.errMsg) {
            Toast.show(sendMsg.errMsg);
        } else if (sendMsg.data) {
            let data = sendMsg.data;
            LoginInfo.setUserInfo(data);
            //NavigationUtil.reset(this.props.navigation, 'Analysis');
            InteractionManager.runAfterInteractions(() => {
                //NavigationUtil.reset(this.props.navigation, 'Home');
                NavigationUtil.reset(this.props.navigation, 'Analysis');
            });
        }
    }
    sendMsg() {
        const { action } = this.props;
        if (!ValidateUtils.checkPhone(userInfo.mobilesequencenumber)) {
            Alert.alert('', '请输入正确的手机号码！', [{ text: '好' }]); return false;
        }
        action.buildRand(userInfo.mobilesequencenumber);
        return true;
    }
    login() {
        const { action } = this.props;
        const { params } = this.props.navigation.state;
        action.appUserlandDX(params.user_name, params.user_password, userInfo.dxyzm);
    }
    render() {
        const { action, sendMsg } = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ebedee' }}>
                <ScrollView>
                    <View style={{ height: 54, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>{'使用该设备首次登陆，请通过短信进行身份验证。'}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                    <TextInput style={{ height: 54, paddingLeft: 8, backgroundColor: '#fff' }}
                        placeholder={'请输入您的手机号'}
                        placeholderTextColor={'#cbcbcb'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        keyboardType={'phone-pad'}
                        autoCorrect={false}
                        onChangeText={(mobilesequencenumber) => {
                            userInfo.mobilesequencenumber = mobilesequencenumber;
                        }}
                    />
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 54, flexDirection: 'row', backgroundColor: '#fff', }}>
                        <TextInput style={{ height: 54, paddingLeft: 8, backgroundColor: '#fff', flex: 1 }}
                            placeholder={'请输入验证码'}
                            placeholderTextColor={'#cbcbcb'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(dxyzm) => {
                                userInfo.dxyzm = dxyzm;
                            }}
                        />
                        <CountDownText
                            onPress={this.sendMsg}
                            buttonStyle={{ margin: 8 }}
                        />
                    </View>

                    <View style={{ elevation: 4, backgroundColor: '#ffffff', marginTop: 50 }}>
                        <TouchableHighlight onPress={
                            () => {
                                if (!userInfo.mobilesequencenumber) {
                                    Toast.show('请输入手机号！'); return;
                                }
                                if (!userInfo.dxyzm) {
                                    Toast.show('请输入验证码！'); return;
                                }
                                dismissKeyboard();
                                this.login()
                            }
                        }
                            underlayColor={'#ffffff'}
                            style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, color: '#2e74bc', }}>立即验证</Text>
                        </TouchableHighlight >
                    </View >
                </ScrollView>
                <View><Spinner visible={sendMsg.loading} text={'登录中,请稍后...'} /></View>
            </View>
        );
    }
}

export default Login4MsgPage;
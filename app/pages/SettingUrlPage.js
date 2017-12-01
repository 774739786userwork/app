import React from 'react';
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import dismissKeyboard from 'dismissKeyboard';
import { Iconfont,FetchManger,LoginInfo,Toast } from 'react-native-go';
import DeviceInfo from '../utils/DeviceInfo';
let inputUrl = undefined;
class SettingUrlPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: '服务器设置',
            headerRight: (<TouchableOpacity onPress={() => {
                navigation.state.params.headerRightPress();
            }}>
                <View style={{ marginRight: 8 }}>
                    <Iconfont
                        icon={'e6a3'} // 图标
                        iconColor={'#fff'}
                        iconSize={22}
                    />
                </View>
            </TouchableOpacity>)
        };
    };

    constructor(props){
        super(props)
        this.onSaveAction = this.onSaveAction.bind(this);
        inputUrl = DeviceInfo.getInfo() ? DeviceInfo.getInfo() : "http://app.duobangjc.com:11009/csbboss/";
    }

    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.onSaveAction,
        })
    }

    onSaveAction(){
        const { navigation } = this.props;
        var Expression=/http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/; 
        var objExp=new RegExp(Expression); 
        if(inputUrl.indexOf("localhost")){ 
            inputUrl = inputUrl.replace("localhost","127.0.0.1"); 
        } 
        if (objExp.test(inputUrl)){
            DeviceInfo.setInfo(inputUrl); 
            LoginInfo.loginOut();   
            FetchManger.initConfig({
                baseUrl: inputUrl,
                expiry: 0
            });
            navigation.goBack();
        }else{
             Toast.show('输入的地址不合法！');
        }
    }
    render() {
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>

                    <View style={{ height: 40, marginTop: 20 }}>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                        <TextInput style={{ height: 40, paddingLeft: 8, backgroundColor: '#fff' }}
                            placeholder={'请输入服务器地址'}
                            placeholderTextColor={'#cbcbcb'}
                            underlineColorAndroid={'transparent'}
                            defaultValue={inputUrl}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(text) => {
                                inputUrl = text;
                            } }
                            />
                    </View>
                </View >
            </View>
        );
  }
}

export default SettingUrlPage;
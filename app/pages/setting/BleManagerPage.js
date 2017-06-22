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
    TouchableOpacity,
    ScrollView,
    InteractionManager
} from 'react-native';
import _ from 'underscore';
import GMBluetooth from 'react-native-gm-bluetooth';
const { ESC, TSC } = GMBluetooth;

import { Iconfont, LoginInfo, LineView, Toast, Spinner, FetchManger } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default class BleManagerPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: '打印小票',
            headerRight: (<TouchableOpacity onPress={() => {
                navigation.state.params.headerRightPress();
            }}>
                <View style={{ marginRight: 8 }}>
                    <Iconfont
                        icon={'e6b0'} // 图标
                        iconColor={'#fff'}
                        iconSize={22}
                    />
                </View>
            </TouchableOpacity>)
        };
    };

    constructor(props) {
        super(props)
        this.headerRightPress = this.headerRightPress.bind(this);
        this._onPrintPress = this._onPrintPress.bind(this)
        this._onPrintTypePress = this._onPrintTypePress.bind(this)
        this.discoverUnpaired = this.discoverUnpaired.bind(this)
        this.pairDevice = this.pairDevice.bind(this)
        this.showBTSettings = this.showBTSettings.bind(this)
        this.gotoSetting = this.gotoSetting.bind(this)
        this.userInfo = {}
        this.state = {
            devices: [],
            showSpinner: false,
            selectItem: 0,
            isEnabled: false,
            discovering: false,
            unpairedDevices: [],
            connected: false,
            section: 0
        }
    }


    componentWillMount() {
        Promise.all([
            GMBluetooth.isEnabled(),
            GMBluetooth.list()
        ])
            .then((values) => {
                const [isEnabled, devices] = values
                this.setState({ isEnabled, devices })
            })

        GMBluetooth.on('bluetoothEnabled', () => Toast.showShortBottom('Bluetooth enabled'))
        GMBluetooth.on('bluetoothDisabled', () => Toast.showShortBottom('Bluetooth disabled'))
        GMBluetooth.on('error', (err) => console.log(`Error: ${err.message}`))
        GMBluetooth.on('connectionLost', () => {
            if (this.state.device) {
                Toast.show(`Connection to device ${this.state.device.name} has been lost`)
            }
            this.setState({ connected: false })
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })
        // 判断蓝牙是否可用
        GMBluetooth.isEnabled().then(result => {
            if (!result) {
                this.showBTSettings()
            }
        }).catch((reason) => {
            this.showBTSettings()
        });

        // 列出已配对的设备列表
        GMBluetooth.list().then(devices => {
            console.log('GMBluetooth list:', devices);
            this.setState({
                devices
            });
        }).catch((reason) => {
            this.setState({ msg: '获取蓝牙列表失败' });
        });
        this.discoverUnpaired();
    }
    gotoSetting() {
        GMBluetooth.showBTSettings();
    }
    showBTSettings() {
        InteractionManager.runAfterInteractions(() => {
            Alert.alert('提示', '蓝牙设置未打开，前往设置？',
                [
                    { text: '设置', onPress: this.gotoSetting },
                    { text: '取消', onPress: () => console.log('Cancel Pressed!') }
                ]
            )
        });
    }

    headerRightPress() {
        this.setState({ msg: '正在刷新' });
        GMBluetooth.list().then(devices => {
            this.setState({
                devices,
                msg: ''
            });
        }).catch((reason) => {
            this.setState({ msg: '刷新失败' });
        });
        this.discoverUnpaired();
    }
    discoverUnpaired() {
        if (this.state.discovering) {
            return false
        } else {
            this.setState({ discovering: true, msg: '正在扫描' })
            GMBluetooth.discoverUnpairedDevices()
                .then((unpairedDevices) => {
                    this.setState({ unpairedDevices, msg: '', discovering: false })
                })
                .catch((reason) => {
                    this.setState({ msg: '扫描失败' });
                });
        }
    }

    pairDevice(device) {
        GMBluetooth.pairDevice(device.id)
            .then((paired) => {
                if (paired) {
                    console.log('Device ${device.name} paired successfully');
                    let devices = this.state.devices
                    devices.push(device)
                    this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
                    Alert.alert('::::::::' + unpairedDevices.name)
                } else {
                    console.log('11111111');
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    handleConnect(device) {
        GMBluetooth.isConnected().then(isConnected => {
            if (isConnected) {
                console.log('已连接');
            } else {
                this.setState({ msg: '正在连接...' });
                GMBluetooth.connect(device.id).then(info => {
                    console.log('GMBluetooth connect to ' + device.id, info);
                    this.setState({
                        connectedID: device.id,
                        msg: '连接成功'
                    });
                }).catch(reason => {
                    Alert.alert('连接失败，检测蓝牙设配是否打开！')
                    this.setState({
                        connectedID: null,
                        weight: null
                    });
                    console.log('GMBluetooth connect to ' + reason);
                    this.setState({ msg: '连接失败，检测蓝牙设配是否打开！' });
                });
            }
        });
    }
    _onPrintTypePress(selectItem) {
        this.setState({ selectItem })
    }
    render() {
        const { isEnabled, devices, unpairedDevices, connectedID, weight } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView>
                    <View style={{ height: 34, backgroundColor: '#f2f2f2', justifyContent: 'center', paddingLeft: 12 }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>{'已配对设备(点击连接)'}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                    {
                        devices.map((device) => {
                            return <TouchableOpacity key={device.id} onPress={this.handleConnect.bind(this, device)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12 }}  >
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#333' }}>{device.name}</Text>
                                        <Text style={{ marginTop: 4, color: '#999' }}>{device.id}</Text>
                                    </View>
                                    <Text style={{}}> {(device.id === connectedID) ? '已连接' : '未连接'}</Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                    <View style={{ height: 34, backgroundColor: '#f2f2f2', justifyContent: 'center', paddingLeft: 12 }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>{'未配对设备'}</Text>
                    </View>
                    {
                        unpairedDevices.map((device) => {
                            return <TouchableOpacity key={device.id} onPress={this.pairDevice.bind(this, device)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12 }}  >
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#333' }}>{device.name}</Text>
                                        <Text style={{ marginTop: 4, color: '#999' }}>{device.id}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                </ScrollView>
                {
                    this.state.msg ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>{this.state.msg}</Text>
                        </View>
                        : null
                }
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', height: 44, }} onPress={this._onPrintTypePress.bind(this, 0)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Iconfont
                                icon={this.state.selectItem === 0 ? 'e662' : 'e663'} // 图标
                                iconColor={'#0081d4'}
                                iconPadding={8}
                                position={'left'}
                                label={'打印一张'}
                                labelColor={'#666'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', height: 44, }} onPress={this._onPrintTypePress.bind(this, 1)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Iconfont
                                icon={this.state.selectItem === 1 ? 'e662' : 'e663'} // 图标
                                iconColor={'#0081d4'}
                                iconPadding={8}
                                position={'left'}
                                label={'打印两张'}
                                labelColor={'#666'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', height: 44, }} onPress={this._onPrintTypePress.bind(this, 2)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Iconfont
                                icon={this.state.selectItem === 2 ? 'e662' : 'e663'} // 图标
                                iconColor={'#0081d4'}
                                iconPadding={8}
                                position={'left'}
                                label={'打印三张'}
                                labelColor={'#666'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }} />
                <View style={{ height: 58, paddingLeft: 12, paddingRight: 12, paddingBottom: 8, paddingTop: 6 }}>
                    <TouchableHighlight onPress={this._onPrintPress.bind(this)} style={{ flex: 1, alignItems: 'center', height: 40, borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#17c6c1', borderColor: '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                            <Iconfont
                                label={'打印小票'}
                                labelSize={16}
                                labelColor={'#fff'}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
                <View><Spinner visible={this.state.showSpinner} /></View>
            </View >);
    }
    componentDidUnMount() {
        GMBluetooth.disconnect();
    }


    _onPrintPress() {
        // 一定要配置好
        const Config = {
            wordNumber: 32
        };
        ESC.setConfig(Config);


        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text('多邦建材打印测试单');
            ESC.printAndNewLine();

            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('开单时间：2017-04-18 14:30:23');
            ESC.printAndNewLine();
            ESC.text('店名：平价建材');
            ESC.printAndNewLine();
            ESC.text('地址：梅溪湖壹号10栋地下室');
            ESC.printAndNewLine();
            ESC.text('联系人：张先生');
            ESC.printAndNewLine();
            ESC.text('电  话：15201083760');
            ESC.printAndNewLine();
            ESC.text('送货人：黄爱国');
            ESC.printAndNewLine();
            ESC.text('联系方式：13677360984');
            ESC.printAndNewLine();
            ESC.text('车牌号：湘AMH716');
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始
            ESC.text(ESC.Util.leftRight('产品名称：外墙抗裂腻子（敬天爱人）', '', 20));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight('数量：2', '', 20));
            ESC.printAndNewLine();
            ESC.alignRight();
            ESC.text('￥12.00');
            ESC.printAndNewLine();
            ESC.alignRight();
            ESC.text('数量小计：2');
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight('数量总计：2', '', 2));
            ESC.alignRight();
            ESC.text('  ');
            ESC.text('总计金额：12.00');
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight('其中押金：0.00', '', 0));
            ESC.text('  ');
            ESC.alignRight();
            ESC.text('本单实收：12.00');
            ESC.printAndNewLine();
            ESC.alignRight();
            ESC.text('本单未收：0.00');
            ESC.printAndNewLine();
            // 商品结束
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();

            ESC.init();
            ESC.text('客户签名：______________________');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.alignCenter();
            ESC.text('客服热线');
            ESC.printAndNewLine();
            ESC.alignCenter();
            ESC.text('400-602-2228');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
        }
        ESC.sound();
        ESC.init();
    }
}

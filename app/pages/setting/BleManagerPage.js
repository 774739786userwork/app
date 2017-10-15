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
    InteractionManager,
    ActivityIndicator,
    Platform
} from 'react-native';
import _ from 'underscore';
import GMBluetooth from 'react-native-gm-bluetooth';
const { ESC, TSC } = GMBluetooth;
import { NavigationActions } from 'react-navigation'
import * as NumberUtils from '../../utils/NumberUtils'
import * as DateUtils from '../../utils/DateUtils'
import Config from '../../utils/Config';

import { Iconfont, LoginInfo, LineView, Toast, Spinner, FetchManger, LoadingView } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';
const WINDOW_WIDTH = Dimensions.get('window').width;
//Platform.OS === 'ios'
export default class BleManagerPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        if (Platform.OS === 'ios') {
            return { title: '打印小票' };
        } else {
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
        }

    };

    constructor(props) {
        super(props)
        this.headerRightPress = this.headerRightPress.bind(this);
        this._onPrintPress = this._onPrintPress.bind(this);
        this._onPrintTypePress = this._onPrintTypePress.bind(this);
        this.listBlueTooth = this.listBlueTooth.bind(this);
        this.pairDevice = this.pairDevice.bind(this);
        this.printCreatorBody = this.printCreatorBody.bind(this);
        this.printBody = this.printBody.bind(this);
        this.autoConnect = this.autoConnect.bind(this);

        this.state = {
            devices: [],
            showSpinner: false,
            selectItem: 1,
            isEnabled: false,
            discovering: false,
            unpairedDevices: [],
            connected: false,
            section: 0,
            connecting_id: '',
            printing: false,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })

        GMBluetooth.on('bluetoothEnabled', () => {
            this.listBlueTooth();
        });
        GMBluetooth.on('bluetoothDisabled', () => {
            this.setState({ isEnabled: false });
            Toast.show('蓝牙已关闭');
        });

        GMBluetooth.on('error', (err) => {
            console.log(`Error: ${err.message}`)
        });

        GMBluetooth.on('connectionLost', () => {
            if (this.state.device) {
                Toast.show(`${this.state.device.name} 连接断开`)
            }
            this.setState({ connected: false });
        });
        this.listBlueTooth();
    }
    //列出 蓝牙
    listBlueTooth() {
        Promise.all([GMBluetooth.isEnabled(), GMBluetooth.list()])
            .then((values) => {
                const [isEnabled, devices] = values;
                if (!isEnabled && Platform.OS === 'android') {
                    GMBluetooth.enable()
                        .then((res) => this.setState({ isEnabled: true }))
                        .catch((err) => Toast.show(err.message))
                }
                this.setState({ isEnabled, devices });
                if(!this.state.connected){
                    let deviceId = Config.get('ble');
                    for (let i = 0; i < devices.length; i++) {
                        if(deviceId == devices[i].id){
                            autoConnect(deviceId);
                        }
                    }
                }
            });
    }
    //自动连接
    autoConnect(deviceId) {
        this.setState({ connecting: true, connecting_id: deviceId })
        GMBluetooth.connect(deviceId)
            .then((res) => {
                this.setState({ connectedID: deviceId, connected: true, connecting: false })
            })
            .catch((err) => {
                this.setState({ connecting: false })
            })
    }

    headerRightPress() {
        if (!this.state.isEnabled) {
            GMBluetooth.enable()
                .then((res) => this.setState({ isEnabled: true }))
                .catch((err) => Toast.show(err.message))

        }
        if (this.state.discovering) {
            return false
        } else {
            this.setState({ discovering: true })
            GMBluetooth.discoverUnpairedDevices()
                .then((unpairedDevices) => {
                    if (unpairedDevices.length === 0) {
                        Toast.show('未找到新设备')
                    }
                    this.setState({ unpairedDevices, discovering: false })
                })
                .catch((err) => Toast.show(err.message))
        }
    }
    handleConnect(device) {
        this.setState({ connecting: true, connecting_id: device.id })
        GMBluetooth.connect(device.id)
            .then((res) => {
                Toast.show(`连接 ${device.name} 成功`)
                Config.put('ble', device.id);
                this.setState({ connectedID: device.id, connected: true, connecting: false })
            })
            .catch((err) => {
                Toast.show(`无法连接到 ${device.name}`)
                this.setState({ connecting: false })

            })
    }
    /**
     * 
     * @param {*配对} device 
     */
    pairDevice(device) {
        GMBluetooth.pairDevice(device.id)
            .then((paired) => {
                if (paired) {
                    Toast.show(`配对成功`)
                    let devices = this.state.devices
                    devices.push(device)
                    this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
                } else {
                    Toast.show(`${device.name} 配对失败`)
                }
            })
            .catch((err) => Toast.show(err.message))
    }
    _onPrintTypePress(selectItem) {
        this.setState({ selectItem })
    }
    render() {
        const { isEnabled, devices, unpairedDevices, connectedID, printing } = this.state;
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
                                    {
                                        this.state.connecting && this.state.connecting_id === device.id ? <ActivityIndicator
                                            size={26} />
                                            : null
                                    }
                                    <Text style={{}}> {(device.id === connectedID) ? '已连接' : '未连接'}</Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                    <View style={{ height: 34, backgroundColor: '#f2f2f2', alignItems: 'center', flexDirection: 'row', paddingLeft: 12 }}>
                        <Text style={{ color: '#999', fontSize: 12, marginRight: 10 }}>{'未配对设备'}</Text>
                        {
                            this.state.discovering ? <ActivityIndicator
                                size={18} />
                                : null
                        }
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

                <View>
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
                        <TouchableHighlight disabled={printing} onPress={this._onPrintPress} style={{ flex: 1, alignItems: 'center', height: 40, borderColor: printing ? '#f2f2f2' : '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }} >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: printing ? '#f2f2f2' : '#17c6c1', borderColor: printing ? '#f2f2f2' : '#17c6c1', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 }}>
                                <Iconfont
                                    label={printing ? '正在打印' : '打印小票'}
                                    labelSize={16}
                                    labelColor={'#fff'}
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <View><Spinner visible={this.state.showSpinner} /></View>
            </View >);
    }
    componentDidUnMount() {
        // GMBluetooth.disconnect();
    }


    _onPrintPress() {
        if (!this.state.connected) {
            Toast.show('请连接蓝牙');
            return;
        }
        const { params } = this.props.navigation.state;
        this.setState({ printing: true });
        if (params.creator) {
            this.printCreatorBody(params)  //送货单打印
        } else if (params.CH) {
            this.printCHBody(params) //车存货打印
        } else if (params.YH) {
            this.printYHBody(params)  //车余货打印
        } else if (params.XH) {
            this.printXHBody(params) //卸货打印
        } else if (params.CXXH) {
            this.printCXXHBody(params) //重新卸货打印
        } else if (params.headerList) {
            this.commPrintBody(params); //退货打印
        } else {
            this.printBody(params)     //送货单重新打印
        }

        this.setState({ printing: false })
        /*
        new Promise(()=>{
            const { navigation } = this.props;
            setTimeout(()=>{
                this.setState({ printing: false })
                InteractionManager.runAfterInteractions(() => {
                    const navigationAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' }),
                        ]
                    })
                    navigation.dispatch(navigationAction)
                });
            },3000);
        });*/
    }

    printBody(param) {
        let title = '送货单'
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text(title);
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //商品开始
            ESC.text('开单时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('店名：' + param.customer_name);
            ESC.printAndNewLine();
            ESC.text('地址：' + param.customer_address);
            ESC.printAndNewLine();
            ESC.text('联系人：' + param.contact_name);
            ESC.printAndNewLine();
            ESC.text('电  话：' + param.contact_mobile);
            ESC.printAndNewLine();
            ESC.text('送货人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('联系方式：' + LoginInfo.getUserInfo().mobile_number);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.car_number);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始
            param.productLists.map((item) => {
                item.gifts_quantity = item.gifts_quantity ? item.gifts_quantity : 0

                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.product_name, '', 20));
                ESC.printAndNewLine();
                ESC.text(ESC.Util.leftRight(`销量：${item.sale_quantity}`, '', 16));
                if (item.gifts_quantity) {
                    ESC.text(ESC.Util.leftRight(`赠送：${item.gifts_quantity}`, '', 16));
                }
                ESC.printAndNewLine();
                ESC.alignRight();
                ESC.text(`￥${item.product_sum ? item.product_sum : 0.00}`);
                ESC.printAndNewLine();
                ESC.alignRight();
                ESC.text('数量小计：' + (item.sale_quantity + item.gifts_quantity));
                ESC.printAndNewLine();
                ESC.text(_.times(Config.wordNumber, () => '-').join(''));
                ESC.printAndNewLine();

            })
            // 商品结束
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.printAndNewLine();

            ESC.text(ESC.Util.leftRight(`数量总计：${param.num + ''}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`总计金额：￥${param.total_sum ? param.total_sum : 0.00}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`其中押金：￥${param.foregift_sum ? param.foregift_sum : 0.00}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`本单实收：￥${param.paid_total_sum ? param.paid_total_sum : 0.00}`, '', 16));
            ESC.printAndNewLine();
            var arr = []
            if (!this.isNull(param.unpaid_total_sum)) {
                arr.push(`本单未收：￥${param.unpaid_total_sum}`)
            }
            if (!this.isNull(param.discount_sum)) {
                arr.push(`优惠金额：￥${param.discount_sum}`)
            }
            if (!this.isNull(param.distribution_sum)) {
                arr.push(`铺货总额：￥${param.distribution_sum}`)
            }
            for (var j = 0; j < arr.length; j++) {
                ESC.text(ESC.Util.leftRight(arr[j], '', 16));
                if (j / 3 == 0) {
                    ESC.printAndNewLine();
                }
            }
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
    //通用打印表单
    commPrintBody(param) {
        //标题
        let title = param.title
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text(title);
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //头部信息
            param.headerList.map((item) => {
                ESC.text(item.text + '');
                ESC.printAndNewLine();
            })
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            //详细信息
            param.detailList.map((item) => {
                item.map((subItem) => {
                    if (subItem.title) {//靠右对齐
                        ESC.alignLeft();
                        ESC.text(subItem.text);
                    } else {//靠左对齐
                        ESC.text(ESC.Util.leftRight(subItem.text ? subItem.text : '', '', 16));
                        ESC.text(ESC.Util.leftRight(subItem.text1 ? subItem.text1 : '', '', 16));

                    }
                    ESC.printAndNewLine();
                });
                ESC.text(_.times(Config.wordNumber, () => '-').join(''));
                ESC.printAndNewLine();
                ESC.printAndNewLine();
            })

            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            //footer
            param.footerList.map((item) => {
                ESC.text(ESC.Util.leftRight(item.text ? item.text : '', '', 16));
                ESC.printAndNewLine();
                ESC.text(ESC.Util.leftRight(item.text1 ? item.text1 : '', '', 16));
                ESC.printAndNewLine();
            });
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text(param.name + '：______________________');
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
    /**
"100003"
dxyzm:""
mobile_number:""
mobilesequencenumber:"85fe1ff13ba552a4"
org_pinyin:"KMDB"
organization_id:"100002"
organization_name:"昆明多邦"
password:"123456"
roles:""
token:"LE55ozyx0hKe1k8"
user_id:"100002"
user_real_name:"张士军"
username:"zhangshijun"     
     */

    printCreatorBody(param) {
        let title = '送货单'
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text(title);
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //商品开始
            ESC.text('开单时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('店名：' + param.customersName);
            ESC.printAndNewLine();
            ESC.text('地址：' + param.address);
            ESC.printAndNewLine();
            ESC.text('联系人：' + param.contacts[0].name);
            ESC.printAndNewLine();
            ESC.text('电  话：' + param.contacts[0].mobile1);
            ESC.printAndNewLine();
            ESC.text('送货人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('联系方式：' + LoginInfo.getUserInfo().mobile_number);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.selectCar.platenumber);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始
            param.chooseList.map((item) => {
                item.gifts_quantity = item.gifts_quantity ? item.gifts_quantity : 0
                let total = item.product_sum ? item.product_sum : 0.00
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.name, '', 20));
                ESC.printAndNewLine();
                ESC.text(ESC.Util.leftRight(`销量：${item.sale_quantity}`, '', 16));
                if (item.gifts_quantity) {
                    ESC.text(ESC.Util.leftRight(`赠送：${item.gifts_quantity}`, '', 16));
                }
                ESC.printAndNewLine();
                ESC.alignRight();
                ESC.text(`￥${NumberUtils.fc(total)}`);
                ESC.printAndNewLine();
                ESC.alignRight();
                ESC.text('数量小计：' + (item.sale_quantity + item.gifts_quantity));
                ESC.printAndNewLine();
            })
            // 商品结束
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            var total = param.total_sum ? param.total_sum : 0.00
            ESC.text(ESC.Util.leftRight(`数量总计：${param.num}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`总计金额：￥${NumberUtils.fc(total)}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`其中押金：￥${param.total_foregift ? param.total_foregift : 0.00}`, '', 16));
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight(`本单实收：￥${param.paid_total_sum ? param.paid_total_sum : 0.00}`, '', 16));
            ESC.printAndNewLine();
            var arr = []
            if (!this.isNull(param.unpaid_total_sum)) {
                arr.push(`本单未收：￥${param.unpaid_total_sum}`)
            }
            if (!this.isNull(param.total_discount_sum)) {
                arr.push(`优惠金额：￥${param.total_discount_sum}`)
            }
            if (!this.isNull(param.distribution_sum)) {
                arr.push(`铺货总额：￥${param.distribution_sum}`)
            }
            for (var j = 0; j < arr.length; j++) {
                ESC.text(ESC.Util.leftRight(arr[j], '', 16));
                if (j / 3 == 0) {
                    ESC.printAndNewLine();
                }
            }

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
    isNull(str) {
        let rel = false;
        if (!str || '0' === str + '' || '0.00' === str + '' || '' === str + '') {
            rel = true
        }
        return rel;
    }
    /**
     * 车存货打印
     */
    printCHBody(param) {
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text('车存货详情如下');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //商品开始
            ESC.text('存货时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('操作人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.selectCar.platenumber);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始

            param.chooseList.map((item) => {
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.product_name, '', 20));
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight(`存货数量：${item.product_stock_quantity}`, '', 20));
            })
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('仓库签名：______________________');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
        }
        ESC.sound();
        ESC.init();
    }

    /**
     * 车余货打印
     */
    printYHBody(param) {
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text('车余货详情如下');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('余货时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('操作人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.selectCar.platenumber);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始

            param.chooseList.map((item) => {
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.product_name, '', 20));
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight(`余货数量：${item.product_stock_quantity}`, '', 20));
            })
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('仓库签名：______________________');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
        }
        ESC.sound();
        ESC.init();
    }

    /**
    * 卸货打印
    */
    printXHBody(param) {
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text('卸货详情如下');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //商品开始
            ESC.text('卸货时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('操作人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.selectCar.platenumber);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始
            param.chooseList.map((item) => {
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.product_name, '', 20));
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight(`卸货数量：${item.disburden_quantity}`, '', 20));
            })
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('仓库签名：______________________');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
        }
        ESC.sound();
        ESC.init();
    }


    /**
    * 重新打印卸货
    */
    printCXXHBody(param) {
        // 一定要配置好
        const Config = { wordNumber: 32 };
        ESC.setConfig(Config);
        ESC.init();
        for (var i = 0; i < this.state.selectItem + 1; i++) {
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.text('卸货详情如下');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            //商品开始
            ESC.text('卸货时间：' + DateUtils.show());
            ESC.printAndNewLine();
            ESC.text('操作人：' + LoginInfo.getUserInfo().user_real_name);
            ESC.printAndNewLine();
            ESC.text('车牌号：' + param.data.platenumber);
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            // 商品开始
            param.data.goodsList.map((item) => {
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight('产品名称：' + item.product_name, '', 20));
                ESC.printAndNewLine();
                ESC.alignLeft();
                ESC.text(ESC.Util.leftRight(`卸货数量：${item.disburden_quantity}`, '', 20));
            })
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.init();
            ESC.text('仓库签名：______________________');
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
        }
        ESC.sound();
        ESC.init();
    }
}

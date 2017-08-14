
import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableHighlight,
    InteractionManager,
    FlatList,
    Alert,
    Linking,
    TouchableOpacity,
    NativeModules,
    NativeAppEventEmitter,
    DatePickerAndroid,
    Platform
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import ImageView from '../../components/ImageView'
import NavigationBar from '../../components/NavigationBar'
import * as ValidateUtils from '../../utils/ValidateUtils';
import EleRNLocation from 'ele-react-native-location';
import ContactsWrapper from 'react-native-contacts-wrapper';


let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let coords = {};
/**
 * mac 6B:83:26:EB:85:8E:94:09:0E:92:EA:2B:0C:64:4E:B3:8E:4D:9E:8A
 * win 19:9D:86:F9:FF:60:2A:9C:76:8B:79:31:CD:52:3C:02:0D:EB:41:C0
 * 开送货单 客户列表
 */
class ListCustomersPage extends React.Component {
    constructor(props) {
        super(props);
        coords = {};
        this._renderItem = this._renderItem.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
        this.onSearchAction = this.onSearchAction.bind(this);
        this.state = {
            defaultValue: ''
        }
    }

    componentWillUnmount() {
        //停止并销毁定位服务
        EleRNLocation.stopLocation();
        EleRNLocation.destroyLocation();
    }
    componentDidMount() {
        const { action } = this.props;
        let options = {
            accuracy: 'HighAccuracy', // BatterySaving(低功耗定位模式), DeviceSensors(仅设备定位模式), HighAccuracy(高精度模式)
            needAddress: true, // 设置是否返回地址信息
            onceLocation: true, // 是否只定位一次
            onceLocationLatest: false,//获取最近3s内精度最高的一次定位结果
            wifiActiveScan: true, // 设置是否强制刷新WIFI，默认为强制刷新,模式为仅设备模式(Device_Sensors)时无效
            mockEnable: false, // 设置是否允许模拟位置,默认为false，不允许模拟位置,模式为低功耗模式(Battery_Saving)时无效
            interval: 2000, // 设置定位间隔,单位毫秒,默认为2000ms
            httpTimeOut: 30000, // 设置联网超时时间(ms), 模式为仅设备模式(Device_Sensors)时无效,默认30000毫秒，建议超时时间不要低于8000毫秒,
            protocol: 'http', //用于设定网络定位时所采用的协议，提供http/https两种协议,默认值http
            locationCacheEnable: false //true表示使用定位缓存策略；false表示不使用。默认是false
        }
        if (Platform.OS == 'ios') {
            options = {
                accuracy: 'kCLLocationAccuracyHundredMeters', // kCLLocationAccuracyHundredMeters, kCLLocationAccuracyBest, kCLLocationAccuracyNearestTenMeters,kCLLocationAccuracyKilometer,kCLLocationAccuracyThreeKilometers
                onceLocation: true, // 是否只定位一次,
                locatingWithReGeocode: true,
                pausesLocationUpdatesAutomatically: true,//指定定位是否会被系统自动暂停。默认为YES
                allowsBackgroundLocationUpdates: false,//是否允许后台定位。默认为NO。只在iOS 9.0及之后起作用。设置为YES的时候必须保证 Background Modes 中的 Location updates 处于选中状态，否则会抛出异常
                locationTimeout: 10,//指定单次定位超时时间,默认为10s。最小值是2s。注意单次定位请求前设置
                reGeocodeTimeout: 5,//指定单次定位逆地理超时时间,默认为5s。最小值是2s。注意单次定位请求前设置
                locatingWithReGeocode: false,//连续定位是否返回逆地理信息，默认NO
                distanceFilter: 'kCLDistanceFilterNone'//设定定位的最小更新距离。默认为 kCLDistanceFilterNone 
            }
        }

        //开启定位服务
        EleRNLocation.startLocation(options);
        //开启定位监听
        EleRNLocation.addEventListener((_coords) => {
            coords = _coords
            action.listCustomers(coords.latitude, coords.longitude);
        });
    }

    onSearchAction(txt) {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            //lat=25.005789&lng=102.770189
            action.listCustomers(coords.latitude, coords.longitude, txt);
            //action.listCustomers(25.005789, 102.770189, txt);
        });
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        navigation.navigate('AddDeliveryOrder', { ...item })
    }
    onTelAction(type, title, customersName, telephone) {
        Alert.alert(customersName + '', telephone,
            [
                {
                    text: title, onPress: () => {
                        let url = type + telephone;
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            } else {
                                console.log('无法打开该URI: ' + this.props.url);
                            }
                        });
                    }
                },
                { text: '取消', onPress: () => console.log('Cancel Pressed!') }
            ]
        )
    }
    /**
     * "address":"昆明国雅建材市场B区2号",
     * "buildingMaterial_id":149,
     * "buildingMaterial_name":"","code":"","contacts":[],
     * "customersId":101532,
     * "customersName":"博信/星祥陶瓷",
     * "imgList":[],
     * "kind_id":0,
     * "kind_name":"","lat":24.992737,"lng":102.762713,
     * "orgId":100002,
     * "orgName":"昆明多邦",
     * "regionaldictionary_id":530111,
     * "sale_area":"昆明市内","sale_area_id":32,"telephone":"6381765 "
     */

    _renderItem = (item, index) => {
        let contactName = "";
        let contactPhone = "";
        if (item.contacts && item.contacts.length > 0) {
            contactName = item.contacts[0].name;
            contactPhone = item.contacts[0].mobile1;
        }

        return (
            <TouchableHighlight
                onPress={this._onItemPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={item && item[0] ? { uri: item[0].img_url } : {}} />
                        </View>
                        <View style={{ flex: 1, paddingLeft: 12, }}>
                            <View style={{ height: 34, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{`${item.customersName}`}</Text>
                            </View>
                            <Text style={{ color: '#666' }}>{`${contactName}`}</Text>
                            <Text style={{ color: '#666' }}>{`${contactPhone}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <TouchableOpacity onPress={this.onTelAction.bind(this, 'tel:', '拨打电话', contactName, contactPhone)}>
                                <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#fb6d23' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e68e'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={14}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ margin: 12 }} onPress={this.onTelAction.bind(this, 'smsto:', '发送短信', contactName, contactPhone)}>
                                <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#18c5c1' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e6c1'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={18}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 12 }}>
                        <Text style={{ color: '#999' }}>{`${item.address}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>
        );
    }
    componentWillReceiveProps(nextProps) {
        const { listCustomers } = nextProps;
        if (listCustomers.errMsg) {
            Toast.show(listCustomers.errMsg);
        }
    }
    headerRightPress = () => {
        const { navigation } = this.props;
        if (!this.importingContactInfo) {
            this.importingContactInfo = true;
            ContactsWrapper.getContact()
                .then((contact) => {
                    let number = contact.number+'';
                    number = number.replace('+86','');
                    number = number.replace('-','');
                    number = number.trim();
                    this.importingContactInfo = false;
                    this.setState({ defaultValue: number + '' })
                    this.onSearchAction(number + '');
                })
                .catch((error) => {
                    Toast.show("没有选择联系人");
                    this.importingContactInfo = false;
                    console.log("ERROR CODE: ", error.code);
                    console.log("ERROR MESSAGE: ", error.message);
                });
        }
        /*
        SelectContacts.pickContact({ timeout: 45000 }, (err, contact) => {
            if (err) {
                if (typeof err === 'object') {
                    if (err.message == "user canceled") {
                        console.log("user hit back button in contact picker");
                    } else if (err.message == "timed out") {
                        Toast.show("选择超时");
                    } else if (err.message == "android version not supported") {
                        Toast.show("当前版本不支持");
                    }
                }
                // log out err object
                console.log(err)
            } else {
                this.setState({ defaultValue: contact.phoneNumbers[0].number + '' })
                this.onSearchAction(contact.phoneNumbers[0].number + '');
            }

        })*/
    }
    renderRightView() {
        return (
            <View>
                <Iconfont
                    icon={'e6c3'} // 图标
                    iconColor={'#fff'}
                    iconSize={22}
                />
            </View>)
    }
    render() {
        const { params } = this.props.navigation.state;

        const { listCustomers } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <NavigationBar title={'客户选择'} navigator={this.props.navigation} rightView={this.renderRightView} onRightButtonPress={this.headerRightPress} />
                <SearchBar
                    defaultValue={this.state.defaultValue}
                    onSearchChange={(text) => {
                        this.setState({ defaultValue: '' })
                        if (ValidateUtils.checkMobile(text)) {
                            this.onSearchAction(text);
                        }
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onClose={() => {
                        this.onSearchAction();
                    }}
                    placeholder={'请输入手机号码查询'}
                    autoCorrect={false}
                    padding={8}
                    returnKeyType={'search'}
                />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />

                <View style={{ flex: 1 }}>
                    {
                        listCustomers.loading ?
                            <LoadingView /> :
                            (listCustomers.data.length > 0 ?
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={dataSource.cloneWithRows(listCustomers.data)}
                                    renderRow={this._renderItem}
                                />
                                :
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 无相关数据</Text>
                                </View>
                            )

                    }
                </View>
            </View >
        );
    }
}

export default ListCustomersPage;

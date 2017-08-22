/**
 * @desc 新增客户
 */
import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
    Dimensions,
    View,
    TouchableOpacity,
    Modal,
    Platform
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import SelectEARModel from './SelectEARModel'
import SaleAreaModel from './SaleAreaModel'
import CustomerKindsModel from './CustomerKindsModel'
import BuildingMaterialModel from './BuildingMaterialModel'
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import EleRNLocation from 'ele-react-native-location';

var WINDOW_WIDTH = Dimensions.get('window').width;

class AddCustContainer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: '新增客户',
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


    constructor(props) {
        super(props)
        this.pickerImage = this.pickerImage.bind(this);
        this.headerRightPress = this.headerRightPress.bind(this)
        this.state = {
            imgs: [],
            regional: undefined,
            regionalShow: false,
            cityId: undefined,
            saleArea: undefined,
            saleAreaShow: false,
            customerKinds: undefined,
            customerKindsShow: false,
            buildingMaterial: undefined,
            buildingMaterialShow: false,
            showSpinner: false,
            viewImageIndex: -1,
        }
        this.customerName = ''
        this.customerDetailAddress = ''
        this.customerPhone = ''
        this.mainContacts = ''
        this.mainMobile = ''
        this.secondaryContact = ''
        this.secondaryMobile = ''
        this.coords = {};
    }

    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })

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
            this.coords = _coords;
        });
    }

    componentWillUnmount() {
        //停止并销毁定位服务
        EleRNLocation.stopLocation();
        EleRNLocation.destroyLocation();
    }

    headerRightPress() {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;
        /**
         proviceId	int	省id
         cityId	int	市id
         districtId	int	区id
         customerKindsId	Int array	店面类型id
         salerAreaId	int	销售区域id
         buildingMaterialId	int	建材市场id
         Longitude	flot	经度
         Latitude	flot	纬度
         Image[{}]	JsonArray	图片数组
         */
        let saveParams = {};
        //coords.latitude, coords.longitude
        saveParams.Longitude = this.coords.longitude;
        saveParams.Latitude = this.coords.latitude;
        saveParams.token = token;
        saveParams.customerName = this.customerName;
        if (!this.customerName) {
            Toast.show('客户名称不能为空')
            return;
        }
        saveParams.customerDetailAddress = this.customerDetailAddress;
        if (!this.customerName) {
            Toast.show('客户名称不能为空')
            return;
        }
        saveParams.customerPhone = this.customerPhone;
        saveParams.secondaryContact = this.secondaryContact;
        saveParams.secondaryMobile = this.secondaryMobile;

        saveParams.user_id = user_id;
        saveParams.organization_id = organization_id;
        saveParams.customerKindsId = this.state.customerKinds ? this.state.customerKinds.childrentPositionId : undefined
        saveParams.salerAreaId = this.state.saleArea ? this.state.saleArea.salerId : undefined
        if (!this.state.regional) {
            Toast.show('请选择行政区域')
            return;
        }
        if (!saveParams.customerKindsId) {
            Toast.show('请选择客户类型')
            return;
        }
        if (!this.state.saleArea) {
            Toast.show('请选择销售区域')
            return;
        }
        if ("20004" === (saveParams.customerKindsId + "") && !this.state.buildingMaterial) {
            Toast.show('请选择建材市场')
            return;
        }
        saveParams.mainContacts = this.mainContacts;
        if (!this.mainContacts) {
            Toast.show('首要联系人不能为空')
            return;
        }
        saveParams.mainMobile = this.mainMobile;
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.mainMobile))) {
            Toast.show("首要联系人手机号码有误，请重填");
            return;
        }
        if (this.state.buildingMaterial) {
            saveParams.buildingMaterialId = this.state.buildingMaterial.buildingMaterialId;
        }
        saveParams.cityId = this.state.cityId;
        saveParams.proviceId = this.state.proviceId;
        saveParams.districtId = this.state.regional.districtsId;

        const { navigation } = this.props;

        this.setState({ showSpinner: true })
        FetchManger.postUri('/mobileServiceManager/customers/toAddCustomers.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                Toast.show('保存成功')
                navigation.goBack();
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }
    pickerImage() {
        var options = {
            title: '选择头像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '相册',
            mediaType: 'photo',
            maxWidth: 512,
            maxHeight: 512,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { url: response.uri };
                let imgs = this.state.imgs;
                if (imgs.length < 3) {
                    imgs.push(source);
                    this.setState(imgs);
                }

            }
        });
    }
    removeImage(index) {
        let imgs = this.state.imgs;
        imgs.splice(index, 1);
        this.setState(imgs);
    }

    render() {
        console.log(this.state.imgs)
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', padding: 12, }}>
                        <View style={{ width: 80, height: 80, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={this.pickerImage}>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e6e5'} // 图标
                                    iconColor={'#999'}
                                    iconSize={24}
                                    position={'bottom'}
                                    label={'上传图片'}
                                    labelColor={'#999'}
                                    iconSize={24}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }} />

                        {
                            this.state.imgs.length > 0 ?
                                <TouchableOpacity onPress={() => this.setState({ viewImageIndex: 0 })} onLongPress={this.removeImage.bind(this, 0)}>
                                    <Image source={{ uri: this.state.imgs[0].url }} style={{ width: 80, height: 80 }} />
                                </TouchableOpacity>
                                :
                                <View style={{ width: 80, height: 80, backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e6e5'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={24}
                                        position={'bottom'}
                                        label={'暂无图片'}
                                        labelColor={'#fff'}
                                        iconSize={24}
                                    />

                                </View>

                        }


                        <View style={{ flex: 1 }} />
                        {
                            this.state.imgs.length > 1 ?
                                <TouchableOpacity onPress={() => this.setState({ viewImageIndex: 1 })} onLongPress={this.removeImage.bind(this, 1)}>
                                    <Image source={{ uri: this.state.imgs[1].url }} style={{ width: 80, height: 80 }} />
                                </TouchableOpacity>
                                :
                                <View style={{ width: 80, height: 80, backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e6e5'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={24}
                                        position={'bottom'}
                                        label={'暂无图片'}
                                        labelColor={'#fff'}
                                        iconSize={24}
                                    />

                                </View>

                        }
                        <View style={{ flex: 1 }} />
                        {
                            this.state.imgs.length > 2 ?
                                <TouchableOpacity onPress={() => this.setState({ viewImageIndex: 2 })} onLongPress={this.removeImage.bind(this, 2)}>
                                    <Image source={{ uri: this.state.imgs[2].url }} style={{ width: 80, height: 80 }} />
                                </TouchableOpacity>
                                :
                                <View style={{ width: 80, height: 80, backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e6e5'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={24}
                                        position={'bottom'}
                                        label={'暂无图片'}
                                        labelColor={'#fff'}
                                        iconSize={24}
                                    />

                                </View>

                        }
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'客户名称'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入客户名称'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(customerName) => {
                                this.customerName = customerName
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, width: 100, marginLeft: 12 }}>{'固定电话'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入固定电话'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            keyboardType={'phone-pad'}
                            autoCorrect={false}
                            onChangeText={(customerPhone) => {
                                this.customerPhone = customerPhone
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            regionalShow: true,
                        })
                    }} style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                        <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100, }}>{'行政区域'}</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: '#aaa' }}>{this.state.regional ? this.state.regional.districtsName : '请选择行政区域'}</Text>
                            <View>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e68c'} // 图标
                                    iconColor={'#d9d9d9'}
                                    iconSize={24}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            customerKindsShow: true,
                        })
                    }} style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >

                        <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'客户类型'}</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: '#aaa' }}>{this.state.customerKinds ? this.state.customerKinds.childrentPositionName : '请选择客户类型'}</Text>
                            <View>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e68c'} // 图标
                                    iconColor={'#d9d9d9'}
                                    iconSize={24}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            saleAreaShow: true,
                        })
                    }} style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >

                        <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'销售区域'}</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: '#aaa' }}>{this.state.saleArea ? this.state.saleArea.salerName : '请选择销售区域'}</Text>
                            <View>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e68c'} // 图标
                                    iconColor={'#d9d9d9'}
                                    iconSize={24}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <TouchableOpacity onPress={() => {
                        if (this.state.cityId) {
                            this.setState({
                                buildingMaterialShow: true,
                            })
                        } else {
                            Toast.show('请先选择行政区域')
                        }

                    }} style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >

                        <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'建材市场'}</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: '#aaa' }}>{this.state.buildingMaterial ? this.state.buildingMaterial.buildingMaterialName : '请选择建材市场'}</Text>
                            <View>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e68c'} // 图标
                                    iconColor={'#d9d9d9'}
                                    iconSize={24}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'详细地址'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入详细地址'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(customerDetailAddress) => {
                                this.customerDetailAddress = customerDetailAddress
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 18, width: WINDOW_WIDTH, backgroundColor: '#f2f2f2' }} />
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'首要联系人'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入首要联系人'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(mainContacts) => {
                                this.mainContacts = mainContacts
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />

                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'手机号码'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入手机号码'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'phone-pad'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(mainMobile) => {
                                this.mainMobile = mainMobile
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />

                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'关联联系人'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入关联联系人'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(secondaryContact) => {
                                this.secondaryContact = secondaryContact
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />

                    <View style={{ height: 42, width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16, marginLeft: 12, width: 100 }}>{'手机号码'}</Text>
                        <TextInput style={{ flex: 1, fontSize: 14 }} placeholder={'请输入手机号码'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'phone-pad'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(secondaryMobile) => {
                                this.secondaryMobile = secondaryMobile
                            }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                </ScrollView>
                {
                    Platform.OS === 'ios' ?
                    <KeyboardSpacer /> : null
                }
                <SelectEARModel modalVisible={this.state.regionalShow} onCancelPress={() => {
                    this.setState({
                        regionalShow: false,
                    })
                }}
                    onConfirmPress={
                        (regional, cityId, proviceId) => {
                            this.setState({
                                regional,
                                cityId,
                                proviceId,
                                regionalShow: false,
                            })
                        }
                    } />
                <SaleAreaModel modalVisible={this.state.saleAreaShow} onCancelPress={() => {
                    this.setState({
                        saleAreaShow: false,
                    })
                }}
                    onConfirmPress={
                        (saleArea) => {
                            this.setState({
                                saleArea,
                                saleAreaShow: false,
                            })
                        }
                    } />
                <CustomerKindsModel modalVisible={this.state.customerKindsShow} onCancelPress={() => {
                    this.setState({
                        customerKindsShow: false,
                    })
                }}
                    onConfirmPress={
                        (customerKinds) => {
                            this.setState({
                                customerKinds,
                                customerKindsShow: false,
                            })
                        }
                    } />
                <BuildingMaterialModel modalVisible={this.state.buildingMaterialShow} regionalid={this.state.regional ? this.state.regional.districtsId : ''} onCancelPress={() => {
                    this.setState({
                        buildingMaterialShow: false,
                    })
                }}
                    onConfirmPress={
                        (buildingMaterial) => {
                            this.setState({
                                buildingMaterial,
                                buildingMaterialShow: false,
                            })
                        }
                    } />
                {
                    this.state.imgs.length > 0 ?
                        <Modal visible={this.state.viewImageIndex !== -1} transparent={true} onRequestClose={() => { }}>
                            <ImageViewer imageUrls={this.state.imgs} index={this.state.viewImageIndex} onClick={() => this.setState({ viewImageIndex: -1 })} />
                        </Modal>
                        :
                        null
                }

                <View><Spinner visible={this.state.showSpinner} textContent={'提交中,请稍后...'} /></View>

            </View >
        );
    }
}

export default AddCustContainer;
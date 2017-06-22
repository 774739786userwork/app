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
    Modal
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import SelectEARModel from './SelectEARModel'
import SaleAreaModel from './SaleAreaModel'
import CustomerKindsModel from './CustomerKindsModel'
import BuildingMaterialModel from './BuildingMaterialModel'
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';


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
        navigator.geolocation.getCurrentPosition(
            (initialPosition) => {
                this.coords = initialPosition.coords;
            },
            (error) => {
                Toast.show('请打开软件定位权限')
            }
        );
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
        if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.customerPhone)) {
            Toast.show('固定电话有误，请重填')
            return;
        }


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
        if (!this.state.buildingMaterial) {
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
        saveParams.buildingMaterialId = this.state.buildingMaterial.buildingMaterialId;
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
                <BuildingMaterialModel modalVisible={this.state.buildingMaterialShow} regionalid={this.state.cityId} onCancelPress={() => {
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
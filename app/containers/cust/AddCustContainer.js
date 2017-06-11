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
    TouchableOpacity
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import SelectEARModel from './SelectEARModel'
import SaleAreaModel from './SaleAreaModel'
import CustomerKindsModel from './CustomerKindsModel'
import BuildingMaterialModel from './BuildingMaterialModel'


var WINDOW_WIDTH = Dimensions.get('window').width;
import { Iconfont } from 'react-native-go';

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
    headerRightPress = () => {
        const { navigation } = this.props;
    }
    constructor(props) {
        super(props)
        this.pickerImage = this.pickerImage.bind(this);
        this.state = {
            imgs: [],
            regional: undefined,
            regionalShow: false,
            saleArea: undefined,
            saleAreaShow: false,
            customerKinds: undefined,
            customerKindsShow: false,
            buildingMaterial: undefined,
            buildingMaterialShow: false,

        }
    }
    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })
    }

    pickerImage() {
        var options = {
            title: '选择头像',
            mediaType: 'photo',
            maxWidth: 256,
            maxHeight: 256,
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
                let source = { uri: response.uri };
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
                                <TouchableOpacity onPress={this.removeImage.bind(this, 0)}>
                                    <Image source={this.state.imgs[0]} style={{ width: 80, height: 80 }} />
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
                                <TouchableOpacity onPress={this.removeImage.bind(this, 1)}>
                                    <Image source={this.state.imgs[1]} style={{ width: 80, height: 80 }} />
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
                                <TouchableOpacity onPress={this.removeImage.bind(this, 2)}>
                                    <Image source={this.state.imgs[2]} style={{ width: 80, height: 80 }} />
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
                            onChangeText={(user_name) => {
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
                            onChangeText={(user_name) => {
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
                        this.setState({
                            buildingMaterialShow: true,
                        })
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
                            onChangeText={(user_name) => {
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
                            onChangeText={(user_name) => {
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
                            onChangeText={(user_name) => {
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
                            onChangeText={(user_name) => {
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
                            onChangeText={(user_name) => {
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
                        (regional) => {
                            this.setState({
                                regional,
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
                <BuildingMaterialModel modalVisible={this.state.buildingMaterialShow} onCancelPress={() => {
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


            </View >
        );
    }
}

export default AddCustContainer;
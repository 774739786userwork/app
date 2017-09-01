import React, {
    Component,
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    NativeAppEventEmitter,
    TouchableHighlight,
    ListView,
    Dimensions,
    Alert,
    Platform,
    TouchableOpacity
} from 'react-native'

import EleRNLocation from 'ele-react-native-location';
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import ImageView from '../../components/ImageView'
import Spinner from 'react-native-loading-spinner-overlay';
import ListItemSetting from '../../components/ListItemSetting';
import WebMapView from './WebMapView'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class CustDetailContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '客户信息',
        };
    };

    constructor(props) {
        super(props);
        this.locationAction = this.locationAction.bind(this)
        this.state = {
            coordinate: {},
            data: {},
            showSpinner: false,
        }
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
        EleRNLocation.addEventListener((coordinate) => {
            this.setState({ coordinate })
        });

        let preParams = this.props.navigation.state.params
        let customersId = preParams.customer_id
        const token = LoginInfo.getUserInfo().token;
        let params = { token, customersId };
        FetchManger.getUri('mobileServiceManager/customers/getCustomersDetailInfos.page', params).then((responseData) => {
            this.setState({ loading: false })
            if (responseData.status === '0' || responseData.status === 0) {
                this.setState({ data: responseData.data })
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            Toast.show('获取失败')
        })
    }
//latitude: result.coordinate.latitude,
        //longitude: result.coordinate.longitude,
    locationAction() {
        this.setState({ showSpinner: true })
        const token = LoginInfo.getUserInfo().token;
        let preParams = this.props.navigation.state.params
        let customersId = preParams.customer_id
        let lng = this.state.coordinate.longitude
        let lat = this.state.coordinate.latitude
        let saveParams = {token,customersId,lng,lat}//customersId lng lat
        FetchManger.postUri('mobileServiceManager/customers/locationPosition.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                Toast.show('标记成功')
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            this.setState({ showSpinner: false })
            Toast.show('标记失败')
        })
    }
    render() {
        let item = this.state.data
        let contacts = item.contacts;
        let users = ''
        if (contacts) {
            contacts.map((item) => {
                users += item.contact_name + ' '
            })
        }

        let img = "";
        if(item.images && item.images.length > 0){
            img = item.images[0].img_url;
        }
        console.log("=========>"+img)
        return (
            <View style={{ flex: 1, }}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView style={{ width: 80, height: 80, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: img }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 34, paddingLeft: 10, marginBottom: 4, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{item.customerName}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, marginBottom: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 40 }}>{'编码'}</Text>
                                <Text style={{ color: '#666' }}>{`${item.customerCode ? item.customerCode : ''}`}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, marginBottom: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 40 }}>{'分类'}</Text>
                                <Text style={{ color: '#666' }}>{`${item.remain_count ? item.remain_count : ''}`}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, marginBottom: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 40 }}>{'区域'}</Text>
                                <Text style={{ color: '#666' }}>{`${item.regionalName ? item.regionalName : ''}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
                <View style={{ backgroundColor: '#f2f2f2', height: 12 }}></View>
                <ListItemSetting
                    icon='e6b1'
                    iconColor='#f74171'
                    onPress={this.onUpdatePWDAction}
                    showText={users} />
                <ListItemSetting
                    icon='e621'
                    iconColor='#f9ae0f'
                    onPress={this.onBlueAction}
                    showText='快速开单' />
                <ListItemSetting
                    icon='e679'
                    iconColor='#18c5c0'
                    value={' '}
                    onPress={this.onUpdateAction}
                    showText={this.state.data.customerAddress} />
                <View style={{ position: 'relative', flex: 1 }}>
                    {
                        this.state.coordinate.latitude ?
                            <WebMapView
                                coordinate={this.state.coordinate}
                            />
                            : null
                    }
                </View>
                <View style={{ height: 48, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{ marginLeft: 12 }}>
                        <Iconfont fontFamily={'OAIndexIcon'}
                            icon={'e679'} // 图标
                            iconColor={'#666'}
                            iconSize={22}//address
                        />
                    </View>
                    <Text style={{ flex: 1, color: '#666' }}>{this.state.coordinate.address ? this.state.coordinate.address : ''}</Text>
                    {
                        this.state.coordinate.latitude ?
                            <View style={{ width: 120, backgroundColor: '#fe6732', alignItems: 'center', justifyContent: 'center', }}>
                                <TouchableHighlight underlayColor='#fe6732' onPress={this.locationAction}>
                                    <View>
                                        <Iconfont fontFamily={'OAIndexIcon'}
                                            icon={'e679'} // 图标
                                            iconColor={'#fff'}
                                            label={'确认标注'}
                                            labelColor={'#fff'}
                                            iconSize={22}
                                            labelSize={16}
                                        />
                                    </View>
                                </TouchableHighlight>
                            </View>
                            : null
                    }


                </View>
                <View><Spinner visible={this.state.showSpinner} textContent={''} /></View>

            </View>
        )
    }

    componentWillUnmount() {
        //停止并销毁定位服务
        EleRNLocation.stopLocation();
        EleRNLocation.destroyLocation();
    }

}

export default CustDetailContainer
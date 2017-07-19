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
} from 'react-native'

import AMapLocation from 'react-native-smart-amap-location'
import AMap from 'react-native-smart-amap'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import TimerEnhance from 'react-native-smart-timer-enhance'
import Button from 'react-native-smart-button'
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import ImageView from '../../components/ImageView'
import ListItemSetting from '../../components/ListItemSetting';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class CustDetailContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '客户信息',
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            coordinate: {},
            data: {}
        }
    }

    componentDidMount() {
        AMapLocation.init(null)
        AMapLocation.getLocation()
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('amap.location.onLocationResult', this._onLocationResult)
        )
        let customersId = '1088505157'
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

    render() {
        let item = this.state.data
        debugger
        return (
            <View style={{ flex: 1, }}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.image }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 34, paddingLeft: 10, marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{item.customerName}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 110 }}>{'编码'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.customerCode }`}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 110 }}>{'分类'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.remain_count }`}</Text>
                            </View>
                            <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#666', width: 110 }}>{'区域'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${item.regionalName}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
                <View style={{backgroundColor:'#f2f2f2',height:12}}></View>
                <ListItemSetting
                    icon='e6b1'
                    iconColor='#f74171'
                    onPress={this.onUpdatePWDAction}
                    showText='' />
                <ListItemSetting
                    icon='e621'
                    iconColor='#f9ae0f'
                    onPress={this.onBlueAction}
                    showText='快速开单' />
                <ListItemSetting
                    icon='e679'
                    iconColor='#18c5c0'
                    onPress={this.onUpdateAction}
                    showText={this.state.data.customerAddress} />
                <View style={{ position: 'relative', height: 240 }}>
                    {
                        this.state.coordinate.latitude ?
                            <AMap
                                style={{ flex: 1 }}
                                options={{
                                    frame: {
                                        width: deviceWidth,
                                        height: 240,
                                    },
                                    showsUserLocation: true,
                                    userTrackingMode: Platform.OS == 'ios' ? AMap.constants.userTrackingMode.none : null,
                                    centerCoordinate: {
                                        latitude: this.state.coordinate.latitude,
                                        longitude: this.state.coordinate.longitude,
                                    },
                                    zoomLevel: 18.1,
                                    centerMarker: Platform.OS == 'ios' ? 'icon_location' : 'poi_marker',
                                }}
                            />
                            : null
                    }
                    <Button
                        touchableType={Button.constants.touchableTypes.highlight}
                        underlayColor={'#ccc'}
                        style={{ padding: 5, alignItems: 'center', position: 'absolute', left: 20, bottom: 20, backgroundColor: '#fff', justifyContent: 'center', borderRadius: 3, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ffffff', }}
                        onPress={() => {
                            AMapLocation.init(null)
                            AMapLocation.getLocation()
                        }}>
                        <View >
                            <Iconfont
                                icon={'e68d'} // 图标
                                iconColor={'#c4c4c4'}
                                iconSize={28}
                            />
                        </View>
                    </Button>
                </View>
            </View>
        )
    }


    _onLocationResult = (result) => {
        if (result.error) {
            console.log(`map-错误代码: ${result.error.code}, map-错误信息: ${result.error.localizedDescription}`)
        }
        else {
            if (result.formattedAddress) {
                console.log(`map-格式化地址 = ${result.formattedAddress}`)
            }
            else {
                console.log(`map-纬度 = ${result.coordinate.latitude}, map-经度 = ${result.coordinate.longitude}`)
                let coordinate = {
                    latitude: result.coordinate.latitude,
                    longitude: result.coordinate.longitude,
                }
                this.setState({ coordinate })
            }
        }
    }

    componentWillUnmount() {
        //停止并销毁定位服务
        AMapLocation.cleanUp()
    }

}

export default TimerEnhance(AppEventListenerEnhance(CustDetailContainer))
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

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class CustDetailContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coordinate: {}
        }
    }

    componentDidMount() {
        AMapLocation.init(null)
        AMapLocation.getLocation()
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('amap.location.onLocationResult', this._onLocationResult)
        )
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <View style={{ flex: 1 }}>
                </View>
                <View style={{ position: 'relative', height: 240 }}>
                    {
                        this.state.coordinate.latitude ?
                            <AMap
                                style={{ flex: 1}}
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
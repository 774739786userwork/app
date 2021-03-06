import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import ImageView from '../../components/ImageView'
import ContactsWrapper from 'react-native-go-contacts';
import * as ValidateUtils from '../../utils/ValidateUtils';
import EleRNLocation from 'ele-react-native-location';


let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let coords = {};

/**
 * 
 * 客户选择 页面
 */
class SelectCustomersContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: '客户选择',
      headerRight: (<TouchableOpacity onPress={() => {
        navigation.state.params.headerRightPress();
      }}>
        <View style={{ marginRight: 8 }}>
          <Iconfont
            icon={'e6c3'} // 图标
            iconColor={'#fff'}
            iconSize={26}
          />
        </View>
      </TouchableOpacity>)
    };
  };
  constructor(props) {
    super(props);
    coords = {};
    this._renderItem = this._renderItem.bind(this);
    this._onItemPress = this._onItemPress.bind(this);
    this.onSearchAction = this.onSearchAction.bind(this);
    this.headerRightPress = this.headerRightPress.bind(this)
    this.listCustomers = this.listCustomers.bind(this)
    this.state = {
      defaultValue: '',
      data: [],
      loading: false,
    }
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
      // action.listCustomers(coords.latitude, coords.longitude);
      this.listCustomers()
      // action.listCustomers(25.005789, 102.770189);
    });


  }
  //请求数据
  //mobileServiceManager/customers/selectContacts.page?token=2n1aWglKVo&user_id=100012&page=1&rows=1&orgId=100002&contactMobile=
  listCustomers(contactMobile) {
    const token = LoginInfo.getUserInfo().token;
    const user_id = LoginInfo.getUserInfo().user_id;
    const orgId = LoginInfo.getUserInfo().organization_id;
    let params = { token, user_id };

    if (contactMobile) {
      params.contactMobile = contactMobile;
    } else {
      params.orgId = orgId;
      params.lat = coords.latitude;
      params.lng = coords.longitude;
    }
    this.setState({ loading: true });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('mobileServiceManager/customers/selectListCustomers.page', params).then((responseData) => {

        if (responseData.data && responseData.data.status === 0) {
          responseData.status = responseData.data.status;
        }
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data.customerLists;
          this.setState({
            data: data,
            loading: false,
          });
        } else {
          if (responseData.msg) {
            Toast.show(responseData.msg);
          } else {
            this.setState({
              data: [],
              loading: false,
            });
          }

        }
      }).catch((error) => {
        console.log(error)
        Toast.show("网络错误");
      })
    });
  }
  //搜索
  onSearchAction(txt) {
    InteractionManager.runAfterInteractions(() => {
      this.listCustomers(txt);
    });
  }
  _onItemPress(item) {
    const { navigation } = this.props;
    navigation.state.params.callback(item);
    navigation.goBack();
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
  headerRightPress = () => {
    const { navigation } = this.props;
    if (!this.importingContactInfo) {
      this.importingContactInfo = true;
      ContactsWrapper.getContact()
        .then((contact) => {
          console.log(contact)
          let number = contact.phone + '';
          number = number.replace('+86', '');
          number = number.replace(new RegExp(/(-)/g), '');
          number = number.replace(/(^\s*)|(\s*$)/g, '');
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
  }
  handlePress(){

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
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
            this.state.loading ?
              <LoadingView /> :
              (this.state.data && this.state.data.length > 0 ?
                <ListView
                  enableEmptySections={true}
                  dataSource={dataSource.cloneWithRows(this.state.data)}
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
export default SelectCustomersContainer;

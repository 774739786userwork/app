
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
    TouchableOpacity
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import ImageView from '../../components/ImageView'
import NavigationBar from '../../components/NavigationBar'
import SelectContacts from 'react-native-select-contact-android'
import * as ValidateUtils from '../../utils/ValidateUtils';

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let coords = {};
/**
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
            defaultValue:''
        }
    }
    componentDidMount() {
        const { action } = this.props;
        navigator.geolocation.getCurrentPosition(
            (initialPosition) => {
                coords = initialPosition.coords;
                action.listCustomers(coords.latitude, coords.longitude);
            },
            (error) => {
                Toast.show('请打开软件定位权限')
            }
        );
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
        debugger
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
                this.setState({defaultValue:contact.phoneNumbers[0].number + ''})
                this.onSearchAction(contact.phoneNumbers[0].number + '');
            }

        })
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
                <NavigationBar  title={'客户选择'} navigator={this.props.navigation} rightView={this.renderRightView} onRightButtonPress={this.headerRightPress} />
                <SearchBar
                    defaultValue={this.state.defaultValue}
                    onSearchChange={(text) => {
                        this.setState({defaultValue:''})
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

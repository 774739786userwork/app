
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
import { Iconfont, LoadingView } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';

const ic_product = require('../../imgs/ic_product.png')

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
    }
    componentDidMount() {

        navigator.geolocation.getCurrentPosition(
            (initialPosition) => {
                coords = initialPosition.coords;
                this.onSearchAction();
            },
            (error) => console.error(error)
        );
    }
    onSearchAction(txt) {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            //lat=25.005789&lng=102.770189
            //action.listCustomers(coords.latitude,coords.longitude);
            action.listCustomers(25.005789, 102.770189, txt);
        });
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        navigation.navigate('AddDeliveryOrder', { ...item })

    }
    onTelAction(rowData) {
        Alert.alert(rowData.customersName + '', rowData.telephone,
            [
                {
                    text: '拨打电话', onPress: () => {
                        let url = 'tel:' + rowData.TELL;
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
        let contactName = ""
        
        return (
            <TouchableHighlight
                onPress={this._onItemPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                        </View>
                        <View style={{ flex: 1 , paddingLeft: 12,}}>
                            <View style={{ height: 34, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{`${item.customersName}`}</Text>
                            </View>
                            <Text style={{ color: '#666' }}>{`${item.customersName}`}</Text>
                            <Text style={{ color: '#666'}}>{`${item.telephone}`}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                            <TouchableOpacity onPress={this.onTelAction.bind(this, item)}>
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fb6d23' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e68e'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={14}
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

    render() {
        const { params } = this.props.navigation.state;
        const { listCustomers } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <SearchBar
                    onSearchChange={(text) => {
                        if (text && text.length > 0) {
                            this.onSearchAction(text);
                        }
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onBlur={() => {
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
                            (listCustomers.data.lenght == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 无相关数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={dataSource.cloneWithRows(listCustomers.data)}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                </View>
            </View >
        );
    }
}

export default ListCustomersPage;

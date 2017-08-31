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
    FlatList,
    SectionList,
    InteractionManager
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import SelectEARModel from './SelectEARModel'
import SaleAreaModel from './SaleAreaModel'
import CustomerKindsModel from './CustomerKindsModel'
import BuildingMaterialModel from './BuildingMaterialModel'
import ImageView from '../../components/ImageView'
import { Iconfont, FetchManger, LoginInfo, LoadingView } from 'react-native-go';
var WINDOW_WIDTH = Dimensions.get('window').width;




class LeftRegional extends React.Component {
    constructor(props) {
        super(props)
        this.renderSectionListItem = this.renderSectionListItem.bind(this);
        this.state = {
            preSelect: undefined
        }
        this.preSelect = undefined
    }
    sectionAction(item) {
        this.setState({ preSelect: item.regionalId })
    }
    renderSectionListItem(item) {
        let regionalId = item.regionalId
        let preSelect = this.state.preSelect
        if (!this.preSelect) {
            this.preSelect = regionalId
        }
        preSelect = preSelect ? preSelect : this.preSelect
        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${regionalId}`}>
            <View style={{ padding: 10, backgroundColor: preSelect != regionalId ? '#f9f9f9' : '#fff' }}>
                <Text style={{ color: preSelect != regionalId ? '#999' : '#0081d4' }}>{item.regionalName}</Text>
            </View>
        </TouchableOpacity>
    }
    render() {
        return <ScrollView>
            {
                this.props.data.map((item) => {
                    return this.renderSectionListItem(item)
                })
            }
        </ScrollView>
    }
}

let preSelect = 0;
class DeliveryCustomersContainer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '我的客户',
        };
    };

    constructor(props) {
        super(props)
        this.requestData = this.requestData.bind(this)
        this.state = {
            selectIndex: 0,
            selectSection: 0,
            loading: false,
            regionaldictionary_list: []
        }

    }
    componentDidMount() {
        this.requestData(0);
    }

    requestData(selectIndex) {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;
        let params = { token, user_id, organization_id };
        if (selectIndex) {
            if (selectIndex === 1) {
                params.mycustomer_type = 'monthbillingcustomer';
            } else if (selectIndex === 2) {
                params.mycustomer_type = 'vipcustomer';
            }
        }
        this.setState({ loading: true })
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/getDeliveryCustomers.page',
                params).then((responseData) => {
                    if (responseData.status === '0' || responseData.status === 0) {
                        this.setState({ loading: false, regionaldictionary_list: responseData.data.regionaldictionary_list ? responseData.data.regionaldictionary_list : [] })
                    }
                }).catch((error) => {

                })
        });
    }
    _onItemPress(selectIndex) {
        this.setState({ selectIndex })
        this.requestData(selectIndex);
    }
    _onlistItemPress(item) {
        const { navigate } = this.props.navigation;
        navigate('CustDetail', item);
    }
    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }
    _renderSectionHeader = ({ section }) => (
        <View key={`section_${section.key}`} style={{ flex: 1, height: 40, justifyContent: 'center', borderBottomColor: '#efefef', borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: '#efefef', borderTopWidth: StyleSheet.hairlineWidth }}>
            <Text style={{ marginLeft: 12 }} >{section.key}</Text>
        </View>
    )

    _renderItem = ({ item, index }) => {

        let { contact_name, mobile1 } = item.contacts[0] ? item.contacts[0] : {};
        let img = "";
        if(item.images && item.images.length > 0){
            img = item.images[0].imgUrl;
        }
        return (
            <TouchableHighlight
                onPress={this._onlistItemPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                            <ImageView style={{ width: 80, height: 80, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: img }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 32, paddingLeft: 8, marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#333', fontSize: 16 }}>{item.customer_name}</Text>
                            </View>
                            <View style={{ height: 30, paddingLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{contact_name ? contact_name : ''}</Text>
                                    <Text style={{ color: '#666', marginLeft: 6 }}>{mobile1 ? mobile1 : ''}</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, paddingLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ color: '#666' }}>{'上次进货日期：'}</Text>
                                    <Text style={{ color: '#666' }}>{`${item.last_delivery_date}`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#efefef' }} />
                </View>
            </TouchableHighlight>)
    }
    render() {
        let index = this.state.selectIndex
        let regionaldictionary_list = this.state.regionaldictionary_list
        let sectionList = [];
        for (let i = 0; i < regionaldictionary_list.length; i++) {
            let item = regionaldictionary_list[i]
            let section = { data: item.customer_list, key: item.regionalName };
            sectionList.push(section)
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ height: 44, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 44 }}>
                        <TouchableOpacity style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }} onPress={this._onItemPress.bind(this, 0)}>
                            <Text style={{ color: index === 0 ? '#0081d4' : '#222' }}>{'所有客户'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: index === 0 ? '#0081d4' : '#c4c4c4', width: WINDOW_WIDTH / 3 }} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 44 }}>
                        <TouchableOpacity style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }} onPress={this._onItemPress.bind(this, 1)}>
                            <Text style={{ color: index === 1 ? '#0081d4' : '#222' }}>{'活跃客户'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: index === 1 ? '#0081d4' : '#c4c4c4', width: WINDOW_WIDTH / 3 }} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 44 }}>
                        <TouchableOpacity style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }} onPress={this._onItemPress.bind(this, 2)}>
                            <Text style={{ color: index === 2 ? '#0081d4' : '#222' }}>{'大客户'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: index === 2 ? '#0081d4' : '#c4c4c4', width: WINDOW_WIDTH / 3 }} />
                    </View>
                </View>
                {
                    this.state.loading ?
                        <LoadingView />
                        :
                        (regionaldictionary_list.length > 0 ? <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <LeftRegional
                                    data={regionaldictionary_list}
                                />
                            </View>
                            <SectionList
                                style={{ flex: 1 }}
                                renderItem={this._renderItem}
                                renderSectionHeader={this._renderSectionHeader}
                                keyExtractor={this._extraUniqueKey}// 每个item的key
                                sections={sectionList}
                            />
                        </View>
                            :
                            <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                <Text> 暂无数据</Text>
                            </View>)

                }
            </View >
        );
    }
}

export default DeliveryCustomersContainer;


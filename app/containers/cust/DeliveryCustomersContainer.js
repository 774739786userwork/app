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


var WINDOW_WIDTH = Dimensions.get('window').width;
import { Iconfont, FetchManger, LoginInfo, LoadingView } from 'react-native-go';
let preSelect = 0;
class DeliveryCustomersContainer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '我的客户',
        };
    };

    constructor(props) {
        super(props)
        this.renderSectionListItem = this.renderSectionListItem.bind(this)
        this.state = {
            selectIndex: 0,
            selectSection: 0,
            regionaldictionary_list: []
        }

    }
    componentDidMount() {
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const organization_id = LoginInfo.getUserInfo().organization_id;

        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/getDeliveryCustomers.page',
                { token, user_id }).then((responseData) => {
                    if (responseData.status === '0' || responseData.status === 0) {
                        this.setState({ regionaldictionary_list: responseData.data.regionaldictionary_list })
                    }
                }).catch((error) => {

                })
        });
    }
    _onItemPress(selectIndex) {

        this.setState({ selectIndex })

    }
    sectionAction(item) {
        let regionaldictionary_list = this.state.regionaldictionary_list
        preSelect = item.regionalId
        this.setState({ regionaldictionary_list })
    }
    renderSectionListItem({ item, index }) {
        let regionalId = item.regionalId
        if (!preSelect) {
            preSelect = regionalId
        }
        return <TouchableOpacity onPress={this.sectionAction.bind(this, item)}>
            <View style={{ padding: 10, backgroundColor: preSelect != regionalId ? '#f9f9f9' : '#fff' }}>
                <Text style={{ color: preSelect != regionalId ? '#999' : '#0081d4' }}>{item.regionalName}</Text>
            </View>
        </TouchableOpacity>
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
                            <Text style={{ color: index === 0 ? '#0081d4' : '#222' }}>{'所以客户'}</Text>
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

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                        <FlatList
                            data={regionaldictionary_list}
                            keyExtractor={(item) => item.regionalId}
                            renderItem={this.renderSectionListItem}
                        />
                    </View>
                    <SectionList
                        style={{ flex: 1 }}
                        renderItem={({ item }) => <Text>{item.customer_name}</Text>}
                        renderSectionHeader={({ section }) => <Text>{section.key}</Text>}
                        sections={sectionList}
                    />
                </View>



            </View >
        );
    }
}

export default DeliveryCustomersContainer;
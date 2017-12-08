import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../components/LoadingListView'
import ImageView from '../../../components/ImageView'
import * as DateUtils from '../../../utils/DateUtils'
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//新发展客户详情
class NewCustomerDetailPage extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let employeeName = state.params.employeeName;
        let orgName = state.params.orgName;
        let type = state.params.type;
        let currTime = '';
        if(type === 0){
            currTime = state.params.currTime + '年'
        }else{
            currTime = state.params.currTime + '月'
        }
        return { 
            headerTitleStyle: {fontSize: 16},
            title: currTime + orgName + employeeName+'新发展客户分析' 
        };
    };

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderGroup = this._renderGroup.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        let param = {};
        const userId = LoginInfo.getUserInfo().user_id;
        param.userId = userId;
        param.orgId = params.orgId;
        param.type = params.type;
        param.currTime = params.currTime;
        param.customerType = params.customerType;
        param.employeeId = params.employeeId;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getNewCustomerDetail.page', param, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({
                        dataList: data,
                        loading: false
                    })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    _rowOnPress(employeeId, employeeName, item) {

    }
    _onCustomerSaleDetailPress(item) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        let param = { type: params.type, currTime: params.currTime, employeeId: item.employeeId, groupName: item.employeeName };
        navigation.navigate('CustomerSaleDetailPage', param)
    }


    _renderGroup(item, sectionID, index) {
        const { params } = this.props.navigation.state;
        return (
            <View key={`row_${index}`} style={{ backgroundColor: '#ffff' }}>
                <View style={{ height: 8, backgroundColor: '#f9f9f9' }} />
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ padding: 8, flexDirection: 'row', backgroundColor: '#f9f9f9' }}>
                    <Text style={{ color: '#333', flex: 1 }}>{item.customerName}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: '#FF33FF', marginRight: 4, }}>{item.customerPhone}</Text>
                </View>
                {
                    item.orgList.map((orgItem) => <View>
                        <View style={{ height: 30, paddingLeft: 12,marginTop:4, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{`${orgItem.orgName}：`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000', fontSize: 13 }}>{`金额:`}</Text>
                                <Text style={{ color: '#f80000', fontSize: 13 }}>{`${orgItem.totalSum}元`}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#f80000', fontSize: 13 }}>{`未收:`}</Text>
                                <Text style={{ color: '#f80000', fontSize: 13 }}>{`${orgItem.unpaidSum}元`}</Text>
                            </View>
                        </View>
                    </View>)
                }
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 13 }}>{`${item.createTime}由${item.employeeName}开发成${params.orgName}客户`}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderGroup} />
        </View>;
    }
}
export default NewCustomerDetailPage;
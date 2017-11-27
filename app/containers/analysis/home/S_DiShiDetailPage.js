import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    ImageView,
    Text,
    InteractionManager,
    TouchableOpacity
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../components/LoadingListView'
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//分厂地市数据
class S_DiShiDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let type = state.params.param.type;
        let title;
        if(type === 0){
            title = state.params.param.year+'年'+state.params.param.orgName;
        }else{
            title = state.params.param.month+'月'+state.params.param.orgName;
        }
        return {
            headerTitleStyle: {fontSize: 16},
            title: title+`地市销售数据`
        };
    };
    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearMonthDiShiSales.page', params.param).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ dataList: data, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>

                <LoadingListView
                    loading={this.state.loading}
                    listData={ds.cloneWithRows(this.state.dataList)}
                    renderRowView={this._renderRow} />
            </View>
        );
    }
}
export default S_DiShiDetailPage;
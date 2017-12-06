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
        const {params} = this.props.navigation.state;
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

    _renderRow(rowData, rowID) {
        return <View key={`index_${rowID}`}>
            <View style={{ borderColor: '#f2f2f2', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>

                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                    <View style={{ height: 34, paddingLeft: 10, marginBottom: 6, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16 }}>{rowData.orgName}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'销售总额: '}</Text>
                            <Text style={{ color: '#17c6c1' }}>{`${rowData.factoryTotalSum}万`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row'}}>
                            <Text style={{ color: '#666'}}>{'退货: '}</Text>
                            <Text style={{ color: '#17c6c1' }}>{`${rowData.returnTotalSum ? rowData.returnTotalSum:0.00}万`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', }}>{'未收: '}</Text>
                            <Text style={{ color: '#f80000' }}>{`${rowData.factoryUnReceiveSum}万`}</Text>
                        </View>
                    </View>
                </View>
            </View>

        </View>;
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
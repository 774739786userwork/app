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
//统计分析 厂 详情
class S_HomeDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `各分厂数据`
    });
    constructor(props) {
        super(props)
        this._renderSeperator = this._renderSeperator.bind(this);
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
            FetchManger.getUri(params.reqUrl, params.param).then((responseData) => {
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

    onTotalAction(item) {
        const { navigation } = this.props;
        let param = navigation.state.params.param;
        param.orgId = item.orgId;
        navigation.navigate('S_SelasTotalDetailPage', { param })
    }
    onNuShowAction(item) {
        const { navigation } = this.props;
        let param = navigation.state.params.param;
        
        param.orgId = item.orgId;
        navigation.navigate('UnReceivePage', { param })
    }


    _renderRow_old(rowData, rowID) {
        return <View key={`index_${rowID}`}>
            <View style={{ borderColor: '#f2f2f2', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ backgroundColor: '#f9f9f9', height: 20 }} />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                    <View style={{ height: 34, paddingLeft: 10, marginBottom: 6, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{'南厂'}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'销售总额'}</Text>
                            <Text style={{ color: '#666' }}>{`1234万`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'未收'}</Text>
                            <Text style={{ color: '#666' }}>{`34万`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'本周增长'}</Text>
                            <Text style={{ color: '#666' }}>{`1234万`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'预计销量'}</Text>
                            <Text style={{ color: '#666' }}>{`34万`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'同比增长'}</Text>
                            <Text style={{ color: '#666' }}>{`1234万`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'同比增加'}</Text>
                            <Text style={{ color: '#666' }}>{`34万`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>;
    }
    _renderRow(rowData, rowID) {
        return <View key={`index_${rowID}`}>
            <View style={{ borderColor: '#f2f2f2', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>

                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                    <View style={{ height: 34, paddingLeft: 10, marginBottom: 6, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{rowData.orgName}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onTotalAction.bind(this,rowData)}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666', }}>{'销售总额: '}</Text>
                                <Text style={{ color: '#17c6c1' }}>{`${rowData.factoryTotalSum}万`}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onNuShowAction.bind(this,rowData)}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#666', }}>{'未收: '}</Text>
                                <Text style={{ color: '#f80000' }}>{`${rowData.factoryUnReceiveSum}万`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>;
    }
    _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }}
            />
        );
    }
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>

            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderRow} />
        </View>;
    }
}
export default S_HomeDetailPage;
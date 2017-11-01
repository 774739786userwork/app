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
import LoadingListView from '../../../../components/LoadingListView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//系列详情 客户
class UnReceiveCustomerPage extends React.Component {

    constructor(props) {
        super(props)
        this._rowOnPress = this._rowOnPress.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        let p = params.param;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearUnReceive.page', p, 30 * 60).then((responseData) => {
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
    _rowOnPress(item) {

    }
    _renderRow(item, sectionID, index) {
        return (
            <TouchableOpacity
                onPress={this._rowOnPress.bind(this, item)}
                key={`row_${index}`}
            >
                <View style={{marginTop:10,marginLeft:10,marginRight:10,borderRadius:4, backgroundColor: '#fff' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333',  }}>{`${item.userName}`}</Text>
                        </View>
                        <View style={{ height: 24, paddingLeft: 12,paddingBottom:4, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 3, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{'未收：'}</Text>
                                <Text style={{ color: '#999', fontSize: 12 }}>{`${item.unReceive}万元`}</Text>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{'占比：'}</Text>
                                <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.precent}`}</Text>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999', fontSize: 12 }}>{'客户数：'}</Text>
                                <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{`${item.customerQuantity}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
export default UnReceiveCustomerPage;
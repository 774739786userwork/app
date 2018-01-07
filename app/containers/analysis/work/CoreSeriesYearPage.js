import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions
} from 'react-native';

import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go';
import LoadingListView from '../../../components/LoadingListView';
import * as DateUtils from '../../../utils/DateUtils'
import YearPicker from '../../../components/YearPicker'
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class CoreSeriesYearPage extends React.Component {
    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this._renderGroup = this._renderGroup.bind(this);
        this.onloadData = this.onloadData.bind(this);
        this.state = {
            listData:[],
            loading: false,
            activeTab: props.activeTab,
            currTime:DateUtils.yearMonth().year
        }
    }

    componentDidMount() {
        const {activeTab,currTime} = this.state
        this.onloadData(activeTab,currTime)
    }

    onloadData(activeTab,currTime){
        let param = {};
        param.userId = LoginInfo.getUserInfo().user_id;
        param.type = activeTab;
        param.currTime = currTime;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getCoreSeries.page', param, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ listData: data, loading: false })
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }

    _renderGroup(item, sectionID, index) {
        return (
            <View key={`row_${index}`} style={{ borderColor: '#d9d9d9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8,backgroundColor: '#f9f9f9',
                marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ paddingLeft: 10, paddingRight: 10,  }}>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row'}}>
                            <Text style={{ color: '#333', width: 150, fontSize: 15}}>{item.serieslName}</Text>
                            <Text style={{ color: '#333', fontSize: 15, marginRight: 4, }}>{`销售:${item.totalSum}元`}</Text>
                        </View>
                    </View>
                </View>
                {
                    item.orgList.map((item, index) => {
                        return this._renderRow(item, index)
                    })
                }
            </View>
        );
    }

    _renderRow(rowData, rowID) {
        return (<View key={`index_${rowID}`}>
            <View style={{ borderColor: '#d9d9d9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10,marginBottom:10 }}>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#333', width: 150 }}>{`${rowData.orgName}`}</Text>
                            <Text style={{ color: '#333' }}>{`销售:${rowData.orgSum}元`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>)
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{
                paddingTop: 6,
                paddingBottom: 6,
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => {
                }}>
                    <Iconfont
                        icon={'e688'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </TouchableOpacity>
                <YearPicker
                    style={{ width: 120 }}
                    customStyles={{
                        dateText: {
                            fontSize: 16,
                            color: '#666',
                        }
                    }}
                    selY={this.state.currTime}
                    onDateChange={(selY, ymStr) => {
                        this.setState({currTime:selY})
                        const {activeTab} = this.state
                        this.onloadData(activeTab,selY)
                    }}
                />
                <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {
                }}>
                    <Iconfont
                        icon={'e657'} // 图标
                        iconColor={'#aaa'}
                        iconSize={26} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#c4c4c4' }} />
            <View style={{ flex: 1, marginBottom: 8, justifyContent: 'center', alignContent: 'center' }}>
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.listData)}
                renderRowView={this._renderGroup} />
            </View>
        </View>;
    }
}    
export default CoreSeriesYearPage;
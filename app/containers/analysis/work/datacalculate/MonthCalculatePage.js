import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
  InteractionManager,
  ScrollView,
  TouchableOpacity,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LoadingListView from '../../../../components/LoadingListView'
import * as DateUtils from '../../../../utils/DateUtils'
import MonthPicker from '../../../../components/MonthPicker'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class MonthCalculatePage extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        dataList: [],
        loading: false,
        currTime:DateUtils.getYearMonth()
    }
}

    componentDidMount() {
        this._onLoadData();
    }

    _onLoadData(){
        let data = [];
        let item = {
            "orgId":"109",
            "orgName":"北厂",
            "totalSum":"30万",
            "thisWeekIncrease":"25万",
            "expectSalerQuantity":"30万",
            "precent":"10%",
            "increase":"46万"
        }
        for(var i = 0; i < 2; i++){
            data.push(item);
        }
        this.setState({dataList: data, loading: false})
    }

    _renderRow(rowData, rowID) {
        return <View key={`index_${rowID}`}>
            <View style={{ borderColor: '#d9d9d9', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                    <View style={{ height: 34, paddingLeft: 10, marginBottom: 6, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{rowData.orgName}</Text>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'销售总额'}</Text>
                            <Text style={{ color: '#666' }}>{rowData.totalSum}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'本周增长'}</Text>
                            <Text style={{ color: '#666' }}>{rowData.thisWeekIncrease}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'预计销量'}</Text>
                            <Text style={{ color: '#666' }}>{rowData.expectSalerQuantity}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'同比增长'}</Text>
                            <Text style={{ color: '#666' }}>{rowData.precent}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#666', width: 70 }}>{'同比增加'}</Text>
                            <Text style={{ color: '#666' }}>{rowData.increase}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>;
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
                <MonthPicker
                    style={{ width: 120 }}
                    customStyles={{
                        dateText: {
                            fontSize: 16,
                            color: '#666',
                        }
                    }}
                    selY={this.state.selY}
                    selM={this.state.selM}
                    onDateChange={(selY, selM, ymStr) => {
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
            <LoadingListView
                loading={this.state.loading}
                listData={ds.cloneWithRows(this.state.dataList)}
                renderRowView={this._renderRow} />
        </View>;
    }
}

export default MonthCalculatePage;
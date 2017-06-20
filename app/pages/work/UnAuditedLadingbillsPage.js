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
    FlatList
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});
class UnAuditedLadingbillsPage extends React.Component {
    constructor(props) {
        super(props);
        this._selectLadingbillsByDate = this._selectLadingbillsByDate.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this._renderItem = this._renderItem.bind(this);
        this.state = {
            startDate: DateUtils.getYearMonthDay(),
            endDate: DateUtils.getYearMonthDay(),
            count: 0,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { selectLadingbills } = nextProps;
        if (selectLadingbills.errMsg) {
            Toast.show(selectLadingbills.errMsg);
        }
    }
    componentDidMount() {
        const { action } = this.props;
        const { startDate, endDate } = this.state;
        InteractionManager.runAfterInteractions(() => {
             action.selectLadingbills(startDate, endDate);
        });
    }
    _selectLadingbillsByDate(_startDate, _endDate) {
        const { action } = this.props;
        const { startDate, endDate } = this.state;

        if (_startDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectLadingbills(_startDate, endDate);
            });
            this.setState({ startDate: _startDate });
        }
        if (_endDate) {
            InteractionManager.runAfterInteractions(() => {
                action.selectLadingbills(startDate, _endDate);
            });
            this.setState({ endDate: _endDate });
        }

    }
    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ paddingLeft: 12, flexDirection: 'row', alignItems: 'center', height: 34, backgroundColor: '#f9f9f9' }}>
                    <View style={{ marginRight: 4 }}>
                        <Iconfont fontFamily={'OAIndexIcon'}
                            icon='e6bf'
                            iconColor='#118cd7'
                            iconSize={16}
                        />
                    </View>
                    <Text style={{ color: '#118cd7' }}>{item.loadingdate}</Text>
                </View>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#333' }}>{'昆明多帮仓库'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#333' }}>{'湘AUH889'}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#333' }}>{'蓝色大桶胶水'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'小计总数：'}</Text>
                        <Text style={{ color: '#f80000' }}>{'500'}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'仓库库存/订单数:'}</Text>
                        <Text style={{ color: '#f80000' }}>{'100/100'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'余货/实提：'}</Text>
                        <Text style={{ color: '#f80000' }}>{'50/50'}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000' }}>{'总计数量：'}</Text>
                        <Text style={{ color: '#f80000' }}>{'500'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#f80000' }}>{'总重量：'}</Text>
                        <Text style={{ color: '#f80000' }}>{'500KG'}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>);
    }
    //加载更多
    onEndReached() {
        const { action, selectLadingbills } = this.props;
        const { startDate, endDate } = this.state;
        const start = selectLadingbills.listData._cachedRowCount;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                action.selectLadingbills(startDate, endDate, start);
            }
        });
    }
    render() {
        const { selectLadingbills } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ flex: 1 }}>
                    <LoadingListView
                        loading={false}
                        loadMore={selectLadingbills.loadMore}
                        listData={dataSource.cloneWithRows([])}
                        renderRowView={this._renderItem}
                        onEndReached={this.onEndReached} />
                </View>
            </View >
        );
    }
}

export default UnAuditedLadingbillsPage;

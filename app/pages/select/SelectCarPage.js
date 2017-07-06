
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
import { Iconfont, Toast, LoadingView } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class SelectCarPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
        this.onSearchAction = this.onSearchAction.bind(this);

    }
    componentDidMount() {
        const { loadingdate } = this.props.navigation.state.params
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.selectCar(loadingdate);
        });
    }
    componentWillReceiveProps(nextProps) {
        const { selectCar } = nextProps;
        if (selectCar.errMsg) {
            Toast.show(selectCar.errMsg);
        }
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        if (item.status === 0 || item.status === '0') {
            navigation.state.params.callback(item);
            navigation.goBack();
        } else {
            Toast.show(item.msg);
        }

    }
    onSearchAction(text) {
        const { loadingdate } = this.props.navigation.state.params
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.selectCar(loadingdate,text);
        });
    }
    //carweight":"9000","platenumber":
    _renderItem = (item, index) => {
        return (
            <TouchableHighlight onPress={this._onItemPress.bind(this, item)} key={`row_${index}`}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ height: 44, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{item.platenumber}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#999' }}>{`${item.carweight}`}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const { params } = this.props.navigation.state;
        const { selectCar } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <SearchBar
                    onSearchChange={(text) => {
                        this.searchText = text;
                        if (text && text.length > 0) {
                            this.onSearchAction(text);
                        }
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onClose={() => {
                        this.onSearchAction();
                    }}
                    placeholder={'请输入车牌号查询'}
                    autoCorrect={false}
                    padding={8}
                    returnKeyType={'search'}
                />
                <View style={{ flex: 1 }}>
                    {
                        selectCar.loading ?
                            <LoadingView /> :
                            (selectCar.data.lenght == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 无相关数据</Text>
                                </View>
                                :
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={dataSource.cloneWithRows(selectCar.data)}
                                    renderRow={this._renderItem}
                                />
                            )

                    }
                </View>
            </View >
        );
    }
}

export default SelectCarPage;

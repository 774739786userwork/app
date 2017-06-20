
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
import { Iconfont, LoadingView } from 'react-native-go';
import * as DateUtils from '../../utils/DateUtils'
import LoadingListView from '../../components/LoadingListView'
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class ShowSelectCarPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '选车牌号码',
    });
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        navigation.state.params.callback(item);
        navigation.goBack();
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
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>

                <ListView
                    enableEmptySections={true}
                    dataSource={dataSource.cloneWithRows(params.carList)}
                    renderRow={this._renderItem}
                />

            </View >
        );
    }
}

export default ShowSelectCarPage;

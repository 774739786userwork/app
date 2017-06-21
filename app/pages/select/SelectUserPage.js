
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
    SectionList
} from 'react-native';
import { Iconfont, LoadingView } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
import IndexSectionList from './IndexSectionList'

const ITEM_HEIGHT = 50; //item的高度
const HEADER_HEIGHT = 24;  //分组头部的高度
const SEPARATOR_HEIGHT = 0;  //分割线的高度

class SelectUserPage extends React.Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
    }
    componentDidMount() {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.selectName();
        });
    }
    _onItemPress(item) {
        const { navigation } = this.props;
        navigation.state.params.callback(item);
        navigation.goBack();
    }
    _renderItem = (data) => {
        const { item, index } = data;
        return (
            <TouchableHighlight onPress={this._onItemPress.bind(this, item)} key={`row_${index}`}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ height: 44, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#666', fontSize: 16 }}>{item.name}</Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
                </View>
            </TouchableHighlight>
        );
    }
    _renderSectionHeader = (section) => {
        return (
            <View style={{
                justifyContent: 'center',
                height: HEADER_HEIGHT,
                paddingLeft: 20,
                backgroundColor: '#eee'
            }}
                key={`row_${section.section.key}`}
            >
                <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#666'
                }}>{section.section.key.toUpperCase()}</Text>
            </View>
        )
    }
    //这边返回的是A,0这样的数据
    _onSectionselect = (section, index) => {
        // this.refs.list.scrollToIndex({ animated: true, index: 0 })//this.state.sectionSize[index]})
    }

    _getItemLayout(data, index) {
        let [length, separator, header] = [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER_HEIGHT];
        return { length, offset: (length + separator) * index + header, index };
    }
    render() {
        const { selectName } = this.props;
        selectName.data.sort((a, b) => {
            return a.pinyin.charCodeAt(0) - b.pinyin.charCodeAt(0)
        })
        let sectionList = [];
        let preKey = null;
        let section = null;
        for (let i = 0; i < selectName.data.length; i++) {
            let userItem = selectName.data[i];
            if (preKey === userItem.pinyin.charAt(0)) {
                section.data.push(userItem);
            } else {
                preKey = userItem.pinyin.charAt(0);
                section = { data: [], key: preKey };
                section.data.push(userItem);
                sectionList.push(section);
            }
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ flex: 1 }}>
                    {
                        selectName.loading ?
                            <LoadingView /> :
                            (selectName.data.lenght == 0 ?
                                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                                    <Text> 无相关数据</Text>
                                </View>
                                :

                                <View>
                                    <SectionList
                                        ref='list'
                                        enableEmptySections
                                        renderItem={this._renderItem}
                                        renderSectionHeader={this._renderSectionHeader}
                                        sections={sectionList}
                                        keyExtractor={(item, index)=> `key_${index}`}
                                        getItemLayout={this._getItemLayout} />

                                    <IndexSectionList
                                        onSectionSelect={this._onSectionselect} />
                                </View>
                            )

                    }
                </View>
            </View >
        );
    }
}

export default SelectUserPage;

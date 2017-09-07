
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/Actions';
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
    TouchableOpacity,
    InteractionManager,
    SectionList,
    ScrollView
} from 'react-native';
import { Iconfont, LoadingView } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';

const ITEM_HEIGHT = 50; //item的高度
const HEADER_HEIGHT = 24;  //分组头部的高度
const SEPARATOR_HEIGHT = 0;  //分割线的高度

/**
 * 业务员查询
 */
class SelectMuUserContainer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: '业务员查询',
            headerRight: (<TouchableOpacity onPress={() => {
                navigation.state.params.headerRightPress();
            }}>
                <View style={{ marginRight: 8 }}>
                    <Iconfont
                        icon={'e6a3'} // 图标
                        iconColor={'#fff'}
                        iconSize={22}
                    />
                </View>
            </TouchableOpacity>)
        };
    };
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
        this._onSectionselect = this._onSectionselect.bind(this);
        this.onSearchAction = this.onSearchAction.bind(this);
        this.headerRightPress = this.headerRightPress.bind(this);
        this.sectionList = []

        this.state = {
            defaultValue: '',
            selectItem: []
        }
    }
    componentDidMount() {
        const { action } = this.props;
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })
        InteractionManager.runAfterInteractions(() => {
            action.selectName();
        });
    }
    headerRightPress() {
        const { navigation } = this.props;

        let ids  = '';
        let names = '';
        let selectItem = this.state.selectItem;
        selectItem.map((_item) => {
            ids +=_item.id+',';
            names += _item.name+',';
        });

        navigation.state.params.callback({ids,names});
        navigation.goBack();
    }
    componentWillReceiveProps(nextProps) {
        const { selectName } = nextProps;
        selectName.data.sort((a, b) => {
            return a.pinyin.charCodeAt(0) - b.pinyin.charCodeAt(0)
        })
        this.sectionList = [];
        let preKey = null;
        let section = {};
        for (let i = 0; i < selectName.data.length; i++) {
            let userItem = selectName.data[i];
            if (preKey === userItem.pinyin.charAt(0)) {
                section.data.push(userItem);
            } else {
                preKey = userItem.pinyin.charAt(0);
                section = { data: [], key: preKey };
                section.data.push(userItem);
                this.sectionList.push(section);
            }
        }
    }

    onSearchAction(txt) {
        const { action } = this.props;
        InteractionManager.runAfterInteractions(() => {
            action.selectName(txt);
        });
    }

    _onItemPress(item) {
        let isSelect = false;
        let selectItem = this.state.selectItem;
        let _select = [];
        selectItem.map((_item) => {
            if (_item.id === item.id) {
                isSelect = true;
            }

        });
        if (!isSelect) {
            _select.push(item);
        }
        selectItem.map((_item) => {
            if (_item.id === item.id) {
                isSelect = true;
            } else {
                _select.push(_item);
            }

        });

        this.setState({ selectItem: _select })
        this._scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
    _renderItem = (data) => {
        const { item, index } = data;
        let isSelect = false;
        let selectItem = this.state.selectItem;
        selectItem.map((_item) => {
            if (_item.id === item.id) {
                isSelect = true;
            }
        });

        return (
            <TouchableHighlight onPress={this._onItemPress.bind(this, item)} key={`row_${index}`}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ height: 44, paddingLeft: 12, paddingRight: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Iconfont
                                icon={isSelect ? 'e662' : 'e663'} // 图标
                                iconColor={'#0081d4'} />
                        </View>
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
    _onSectionselect(section, index) {
        let toIndex = -1;
        for (let i = 0; i < this.sectionList.length; i++) {
            if (this.sectionList[i].key.toUpperCase() === section) {
                toIndex = i;
            }
        }
        if (toIndex != -1) {
            this.refs.list.scrollToLocation({ animated: true, itemIndex: 0, sectionIndex: toIndex - 1 })
        }
    }

    _getItemLayout(data, index) {
        let [length, separator, header] = [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER_HEIGHT];
        return { length, offset: (length + separator) * index + header, index };
    }
    render() {
        const { selectName } = this.props;
        let selectItem = this.state.selectItem;
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <SearchBar
                    defaultValue={this.state.defaultValue}
                    onSearchChange={(text) => {
                        this.setState({ defaultValue: '' })
                        this.onSearchAction(text);
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onClose={() => {
                        this.onSearchAction();
                    }}
                    placeholder={'请输入名字查询'}
                    autoCorrect={false}
                    padding={8}
                    returnKeyType={'search'}
                />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
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
                                        sections={this.sectionList}
                                        keyExtractor={(item, index) => `key_${index}`}
                                        getItemLayout={this._getItemLayout} />
                                </View>
                            )

                    }
                </View>
                <View style={{ height: 40 }}>
                    <ScrollView horizontal={true}
                        ref={(scrollView) => { this._scrollView = scrollView; }}>
                        {
                            selectItem.map((item, index) => <View style={{ height: 30, padding: 12 }} key={`index_${index}`}><Text>{item.name}</Text></View>)
                        }
                    </ScrollView>
                </View >
            </View >
        );
    }
}


const mapStateToProps = (state) => {
    const { selectName } = state;
    return {
        selectName
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectMuUserContainer);

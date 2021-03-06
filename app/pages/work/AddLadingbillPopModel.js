import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Modal,
    TouchableHighlight,
    Platform
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import * as utils from './utils'
import LoadingListView from '../../components/LoadingListView'
import { Iconfont, LoadingView } from 'react-native-go';
import * as NumberUtils from '../../utils/NumberUtils'

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const modelWidth = WINDOW_WIDTH;

class CanEditItem extends React.Component {

    constructor(props) {
        super(props)
        this.updateNewCount = this.updateNewCount.bind(this)
        this.state = {
            real_loading_count: this.props.item.loading_quantity
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            real_loading_count:nextProps.item.loading_quantity
        });
    }
    updateNewCount(count) {
        if (count < 0) {
            count = 0;
        }
        this.setState({ real_loading_count: count });
        let item = this.props.item;
        item.real_loading_count = count -  item.remain_count;//newCount - item.remain_count;
        item.loading_quantity = count;
        this.props.onConfirmPress && this.props.onConfirmPress(item)
    }

    render() {
        let item = this.props.item;

        return <View style={{ backgroundColor: '#fff', width: WINDOW_WIDTH }} >
            <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 16 }}>{item.product_name}</Text>
            </View>
            <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'实提：'}</Text>
                    <Text style={{ color: '#f80000' }}>{`${item.real_loading_count ? item.real_loading_count : 0}`}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: '#666' }}>{'总数：'}</Text>
                    <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: 8, marginRight: 6 }} onPress={() => {
                            let newCount = parseInt(this.state.real_loading_count) - 1;
                            this.updateNewCount(newCount);
                        }}>
                            <Iconfont
                                icon={'e6ba'} // 图标
                                iconColor={'#0081d4'}
                                iconSize={22} />
                        </TouchableOpacity>
                        <TextInput style={{ width: 40, height: 26, fontSize: 14, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                            selectTextOnFocus={true}
                            value={'' + this.state.real_loading_count}
                            defaultValue={'' + this.state.real_loading_count}
                            onChangeText={(newCount) => {
                                let num = parseInt(newCount);
                                this.updateNewCount(isNaN(num) ? 0 : num);
                            }}
                        />
                        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
                            let newCount = parseInt(this.state.real_loading_count) + 1;
                            this.updateNewCount(newCount);
                        }}>
                            <Iconfont
                                icon={'e6b9'} // 图标
                                iconColor={'#0081d4'}
                                iconSize={22}
                            /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>
    }
}

/**
 * 提货单购物车
 */
export default class AddLadingbillPopModel extends React.Component {
    constructor(props) {
        super(props)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.renderRowView = this.renderRowView.bind(this);
        this.numberCarsh = 0
        this.state = {
            modalVisible: props.modalVisible,
            chooseList: [],
        };
    }
    componentWillReceiveProps(nextProps) {
        let chooseList = nextProps.chooseList;
        this.setState({
            modalVisible: nextProps.modalVisible,
            chooseList,
        });
    }


    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
    renderRowView(item, index) {
        return <CanEditItem item={item} key={`row_${index}`} onConfirmPress = {this.props.onConfirmPress}/>
    }
    render() {
        let chooseList = this.state.chooseList;

        let totalNum = 0;
        let totalWeight = 0;
        chooseList.map((a) => {
            let loading_quantity = a.loading_quantity ? parseInt(a.loading_quantity) : 0;
            let itemWeight = NumberUtils.FloatMul(a.product_weight, loading_quantity);
            totalWeight = NumberUtils.FloatAdd(totalWeight, itemWeight);
            totalNum = totalNum + loading_quantity;
        });
        let loading = true
        return (<Modal
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => { }}
            visible={this.state.modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.onCancelPress} />
                <View style={{
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{ backgroundColor: '#0081d4', flexDirection: 'row', paddingLeft: 12, paddingRight: 12, height: 40, width: modelWidth, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#fff' }}>{`购物车`}</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => {
                            this.props.onClear && this.props.onClear()
                            this.setState({ chooseList: [] })
                        }}>
                            <Iconfont
                                icon={'e6c6'} // 图标
                                iconColor={'#fff'}
                                iconSize={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: WINDOW_HEIGHT * 2 / 3 - 160, width: WINDOW_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            chooseList.length > 0 ?
                                <ListView
                                    enableEmptySections={true}
                                    style={{ width: WINDOW_WIDTH }}
                                    dataSource={dataSource.cloneWithRows(this.state.chooseList)}
                                    renderRow={this.renderRowView}
                                />
                                : <Text>{'购物车是空的'}</Text>
                        }
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, width: modelWidth, backgroundColor: '#c4c4c4' }} />
                    <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableHighlight onPress={this.onCancelPress.bind(this)}>
                            <View style={{ width: 50, height: 50, padding: 6, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <Iconfont fontFamily={'OAIndexIcon'}
                                    icon={'e6b5'} // 图标
                                    iconColor={'#999'}
                                    iconSize={30}
                                />
                            </View>
                        </TouchableHighlight>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'总数量：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${totalNum}`}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ color: '#666' }}>{'总质量：'}</Text>
                                <Text style={{ color: '#f80000' }}>{`${totalWeight}KG`}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }} />
                        <TouchableHighlight onPress={this.onCancelPress.bind(this)}>
                            <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff' }}>{'保存'}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                {
                    Platform.OS === 'ios' ?
                        <KeyboardSpacer /> : null
                }
            </View>
        </Modal>)
    }
}
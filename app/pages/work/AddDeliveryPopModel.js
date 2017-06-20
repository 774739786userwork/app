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
    TouchableHighlight
} from 'react-native';
import LoadingListView from '../../components/LoadingListView'
import { Iconfont, LoadingView } from 'react-native-go';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ic_product = require('../../imgs/ic_product.png')
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const modelWidth = WINDOW_WIDTH;

export default class AddDeliveryPopModel extends React.Component {
    constructor(props) {
        super(props)
        this.onCancelPress = this.onCancelPress.bind(this)
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
    renderRowView = (item, index) => {
        let num = (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0)
        return (
            <View style={{ backgroundColor: '#fff', width: WINDOW_WIDTH }} key={`row_${index}`}>
                <View style={{ height: 34, paddingLeft: 12, marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>{item.name}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'单价：'}</Text>
                        <Text style={{ color: '#f80000' }}>{`${item.price}`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'数量：'}</Text>
                        <Text style={{ color: '#f80000' }}>{`${num}`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>{'押金：'}</Text>
                        <Text style={{ color: '#f80000' }}>{`0`}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, marginTop: 12, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>)
    }
    render() {
        let chooseList = this.state.chooseList;
        let num = 0;
        let numberCarsh = 0;
        chooseList.map((item) => {
            num += item.sale_quantity + item.gifts_quantity
            numberCarsh += item.price * item.sale_quantity
        })
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
                            this.setState({
                                chooseList: []
                            })
                        }}>
                            <Iconfont
                                icon={'e6c6'} // 图标
                                iconColor={'#fff'}
                                iconSize={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 160, width: WINDOW_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            num > 0 ?
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
                                {
                                    num > 0 ?
                                        <Text style={{ position: 'absolute', fontSize: 10, padding: 4, top: 6, right: 6, backgroundColor: '#fe6732', color: '#fff', borderRadius: 12 }}>{'' + num}</Text>
                                        : null
                                }
                            </View>
                        </TouchableHighlight>
                        <Text style={{ color: '#f80000' }}>{'￥' + numberCarsh + '元'}</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableHighlight onPress={this.onCancelPress.bind(this)}>
                            <View style={{ width: 100, height: 50, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff' }}>{'结算'}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>)
    }
}
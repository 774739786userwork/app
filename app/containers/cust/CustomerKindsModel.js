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
import { Iconfont } from 'react-native-go';
import Picker from '../../components/Picker/Picker'
import cityCode from './ChinaCityCode'
import { FetchManger, LoginInfo, LoadingView } from 'react-native-go'

const WINDOW_WIDTH = Dimensions.get('window').width;
export default class CustomerKindsModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.renderType2 = this.renderType2.bind(this)
        this.state = {
            modalVisible: false,
            title: '',
            dataList: [],
            loading: true,
        };
        this.rowIndex0 = 0;
        this.rowIndex1 = 0;
    }
    componentDidMount() {
        const token = LoginInfo.getUserInfo().token;
        const user_id =778
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/getCustomerKindsTreeInfo.page', { token, user_id }).then((responseData) => {
               if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data.parentPosition;
                    this.setState({
                        dataList:data,
                        loading:false,
                    });
                }
            }).catch((error) => {

            })
        });
    }
    componentWillReceiveProps(nextProps) {
        this.rowIndex0 = 0;
        this.rowIndex1 = 0;
        this.setState({ 
            modalVisible: nextProps.modalVisible });
    }

    onConfirmPress() {
        let item = this.state.dataList[this.rowIndex0].childrentPosition[this.rowIndex1]
        this.props.onConfirmPress && this.props.onConfirmPress(item)
        this.setState({ modalVisible: false });
    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
   
    renderType2() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <Picker
                    data={this.state.dataList}
                    ref='_Picker0'
                    name='parentPositionName'
                    onRowChange={index => {
                        this.rowIndex0 = index;
                        this.rowIndex1 = 0;
                        this.refs._Picker2.setDataSource(this.state.dataList[this.rowIndex0].childrentPosition)
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Picker
                    data={this.state.dataList[0].childrentPosition}
                    ref='_Picker2'
                    name='childrentPositionName'
                    onRowChange={index => this.rowIndex1 = index}
                />
            </View>
        </View>)
    }
    renderLoading() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <LoadingView />
        </View>)
    }
    
    render() {
        return (<Modal
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => { }}
            visible={this.state.modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ flex: 1 }} />
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 36, width: WINDOW_WIDTH, justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity onPress={this.onCancelPress}>
                        <View style={{ height: 36, width: 40, paddingLeft: 12, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                    </TouchableOpacity>
                    <Text style={{ color: '#666', flex: 1, textAlign: 'center' }}>{this.state.title}</Text>
                    <TouchableOpacity onPress={this.onConfirmPress}>
                        <View style={{ height: 36, width: 40, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fe6732', paddingRight: 12, }}>{'确定'}</Text></View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                {
                    this.state.loading ? this.renderLoading() :  this.renderType2()
                }
            </View>
        </Modal>)
    }
}
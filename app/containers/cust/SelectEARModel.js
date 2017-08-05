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
import { FetchManger, LoginInfo, LoadingView } from 'react-native-go'

const WINDOW_WIDTH = Dimensions.get('window').width;
export default class SelectEARModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.renderType3 = this.renderType3.bind(this)
        this.renderType2 = this.renderType2.bind(this)
        this.renderType1 = this.renderType1.bind(this)

        this.state = {
            modalVisible: false,
            title: '',
            dataList: [],
            type: 1,
            loading: true,
        };
        this.rowIndex0 = 0;
        this.rowIndex1 = 0;
        this.rowIndex2 = 0;
    }
    componentDidMount() {
        const token = LoginInfo.getUserInfo().token;
        const orgId = 107// LoginInfo.getUserInfo().organization_id;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/getRegionalTreeInfo.page', { token, orgId }).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({
                        dataList: data,
                        loading: false,
                        type: 3,
                    });
                }
            }).catch((error) => {

            })
        });
    }
    componentWillReceiveProps(nextProps) {
        this.rowIndex0 = 0;
        this.rowIndex1 = 0;
        this.rowIndex2 = 0;
        this.setState({
            modalVisible: nextProps.modalVisible
        });
    }

    onConfirmPress() {
        if (this.state.dataList && this.state.dataList.length > 0) {
            let item = this.state.dataList[this.rowIndex0].cityList[this.rowIndex1].districtsList[this.rowIndex2]
            let cityId = this.state.dataList[this.rowIndex0].cityList[this.rowIndex1].cityid
            let proviceId = this.state.dataList[this.rowIndex0].provinceId
            this.props.onConfirmPress && this.props.onConfirmPress(item, cityId, proviceId)
            this.setState({ modalVisible: false });
        }else{
            this.onCancelPress()
        }

    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
    renderType3() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <Picker
                    data={this.state.dataList}
                    ref='_Picker0'
                    name='provinceName'
                    onRowChange={index => {
                        this.rowIndex0 = index;
                        this.rowIndex1 = 0;
                        this.rowIndex2 = 0;
                        this.refs._Picker1.setDataSource(this.state.dataList[this.rowIndex0].cityList);
                        this.refs._Picker2.setDataSource(this.state.dataList[this.rowIndex0].cityList[0].districtsList)
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Picker
                    data={this.state.dataList[0].cityList}
                    ref='_Picker1'
                    name='cityname'
                    onRowChange={index => {
                        this.rowIndex1 = index;
                        this.rowIndex2 = 0;
                        this.refs._Picker2.setDataSource(this.state.dataList[this.rowIndex0].cityList[this.rowIndex1].districtsList)
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Picker
                    data={this.state.dataList[0].cityList[0].districtsList}
                    ref='_Picker2'
                    name='districtsName'
                    onRowChange={index => this.rowIndex2 = index}
                />
            </View>
        </View>)
    }
    renderType2() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <Picker
                    data={cityCode.CityZoneCode.China.Province}
                    ref='_Picker0'
                    name='name'
                    onRowChange={index => {
                        this.rowIndex0 = index;
                        this.rowIndex1 = 0;
                        this.rowIndex2 = 0;
                        this.refs._Picker2.setDataSource(cityCode.CityZoneCode.China.Province[this.rowIndex0].City[0].Area)
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Picker
                    data={cityCode.CityZoneCode.China.Province[0].City[0].Area}
                    ref='_Picker2'
                    name='name'
                    onRowChange={index => this.rowIndex2 = index}
                />
            </View>
        </View>)
    }
    renderLoading() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <LoadingView />
        </View>)
    }
    renderType1() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <Picker
                data={cityCode.CityZoneCode.China.Province}
                ref='_Picker0'
                name='name'
                onRowChange={index => {
                    this.rowIndex0 = index;
                }}
            />
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
                        <View style={{ height: 36,paddingLeft: 12, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                    </TouchableOpacity>
                    <Text style={{ color: '#666', flex: 1, textAlign: 'center' }}>{this.state.title}</Text>
                    <TouchableOpacity onPress={this.onConfirmPress}>
                        <View style={{ height: 36, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fe6732', paddingRight: 12, }}>{'确定'}</Text></View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                {
                    this.state.loading ? this.renderLoading() : (this.state.type === 3 ? this.renderType3() : (this.state.type === 2 ? this.renderType2() : this.renderType1()))
                }
            </View>
        </Modal>)
    }
}
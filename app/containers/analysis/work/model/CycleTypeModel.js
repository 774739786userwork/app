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
import Picker from '../../../../components/Picker/Picker'
import { FetchManger, LoginInfo, LoadingView,Toast } from 'react-native-go'

const WINDOW_WIDTH = Dimensions.get('window').width;
export default class BuildingMaterialModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this.renderType1 = this.renderType1.bind(this)

        this.state = {
            modalVisible: false,
            title: '',
            dataList: [],
            loading: true,
        };
        this.rowIndex0 = 0;
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ modalVisible: nextProps.modalVisible });
        const token = LoginInfo.getUserInfo().token;
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getCycleType.page', { token }).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    if(data.length > 0){
                        this.setState({
                            dataList: data,
                            loading: false,
                        });
                    }else{
                        Toast.show('服务器错误')
                    }
                    
                }
            }).catch((error) => {

            })
        });


    }

    onConfirmPress() {
        if (this.state.dataList && this.state.dataList.length > 0) {
            let item = this.state.dataList[this.rowIndex0]
            this.props.onConfirmPress && this.props.onConfirmPress(item)
            this.setState({ modalVisible: false });
        }else{
            this.onCancelPress()
        }

    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
    renderLoading() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <LoadingView />
        </View>)
    }
    renderType1() {
        return (<View style={{ height: 230, flexDirection: 'row' }}>
            <Picker
                data={this.state.dataList}
                ref='_Picker0'
                name='cycleName'
                selectTo={this.rowIndex0}
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
                        <View style={{ height: 36,  paddingLeft: 12, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                    </TouchableOpacity>
                    <Text style={{ color: '#666', flex: 1, textAlign: 'center' }}>{this.state.title}</Text>
                    <TouchableOpacity onPress={this.onConfirmPress}>
                        <View style={{ height: 36, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fe6732', paddingRight: 12, }}>{'确定'}</Text></View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, width: WINDOW_WIDTH, backgroundColor: '#d9d9d9' }} />
                {
                    this.state.loading ? this.renderLoading() : this.renderType1()
                }
            </View>
        </Modal>)
    }
}
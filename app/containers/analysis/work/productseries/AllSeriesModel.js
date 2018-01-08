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
import Picker from '../../../../components/Picker/Picker'
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'

const WINDOW_WIDTH = Dimensions.get('window').width;
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class AllSeriesModel extends React.Component {
    constructor(props) {
        super(props)
        this.onConfirmPress = this.onConfirmPress.bind(this)
        this.onCancelPress = this.onCancelPress.bind(this)
        this._renderGroup = this._renderGroup.bind(this)
        this.state = {
            modalVisible: false,
            title: '',
            dataList: [],
            loading: true,
            selectedIds: []
        };
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        let selectedIds = [];
        if (nextProps.selectedIds) {
            nextProps.selectedIds.map((id) => {
                selectedIds.push(id);
            })
        }
        this.setState({ modalVisible: nextProps.modalVisible, selectedIds });
        if (nextProps.modalVisible) {
            const token = LoginInfo.getUserInfo().token;
            const userId = LoginInfo.getUserInfo().userId;
            InteractionManager.runAfterInteractions(() => {
                FetchManger.getUri('dataCenter/appHomePage/getAllSeries.page', { token, userId }, 30 * 60).then((responseData) => {
                    if (responseData.status === '0' || responseData.status === 0) {
                        let data = responseData.data;
                        if (data.length > 0) {
                            this.setState({
                                dataList: data,
                                loading: false,
                            });
                        } else {
                            Toast.show('服务器错误')
                        }
                    }
                }).catch((error) => {

                })
            });
        }
    }

    onConfirmPress() {
        if (this.state.dataList && this.state.dataList.length > 0) {
            let item = this.state.selectedIds
            let selectedIds = [];
            if (item) {
                item.map((id) => {
                    selectedIds.push(id);
                })
            }
            this.props.onConfirmPress && this.props.onConfirmPress(selectedIds)
            this.setState({ modalVisible: false });
        } else {
            this.onCancelPress()
        }

    }
    onCancelPress() {
        this.props.onCancelPress && this.props.onCancelPress()
        this.setState({ modalVisible: false });
    }
    onItemPress(item) {
        let selectedIds = this.state.selectedIds;
        let selected = false;
        let i = 0;
        for (; i < selectedIds.length; i++) {
            if (selectedIds[i] == item.serieslId) {
                selected = true;
                break;
            }
        }
        if (selected) {
            selectedIds.splice(i, 1);
        } else {
            selectedIds.push(item.serieslId);

        }
        this.setState({ selectedIds })
    }
    _renderGroup(item, sectionID, index) {
        let that = this;
        let selectedIds = this.state.selectedIds;
        return (
            <View key={`row_${index}`}>
                <View style={{ padding: 8, flexDirection: 'row' }}>
                    <Text style={{ color: '#333', fontSize: 16, }}>{item.parentName}</Text>
                </View>
                {
                    item.seriesList.map((seriesItem, s_index) => {
                        let selected = false;
                        for (let i = 0; i < selectedIds.length; i++) {
                            if (selectedIds[i] == seriesItem.serieslId) {
                                selected = true;
                            }
                        }
                        return (
                            <View key={`s_${s_index}`}>
                                <TouchableOpacity onPress={that.onItemPress.bind(this, seriesItem)}>
                                    <View style={{ margin: 8, padding: 8, backgroundColor: selected ? '#fff' : '#f0f2f5', borderRadius: 8, borderColor: selected ? '#0081d4' : '#f0f2f5', borderWidth: 1, flexDirection: 'row' }}>
                                        <Text style={{ color: selected ? '#0081d4' : '#333', fontSize: 12 }}>{seriesItem.serieslName}</Text>
                                        <View style={{ flex: 1 }} />
                                        {
                                            selected ?
                                                <View>
                                                    <Iconfont
                                                        icon={'e6a3'} // 图标
                                                        iconColor='#0081d4'
                                                        iconSize={12}
                                                    />
                                                </View>
                                                : null
                                        }

                                    </View>
                                </TouchableOpacity>
                            </View>)
                    })
                }
            </View>
        );
    }
    render() {
        return (<Modal
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => { }}
            visible={this.state.modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 8, paddingTop: 15, backgroundColor: '#fff' }}>
                    <View style={{ flex: 1 }} >
                        <LoadingListView
                            loading={this.state.loading}
                            listData={ds.cloneWithRows(this.state.dataList)}
                            renderRowView={this._renderGroup} />
                    </View>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 40, marginBottom: 10, paddingTop: 12, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={this.onCancelPress}>
                            <View style={{ height: 40, borderRadius: 8, backgroundColor: '#eeeeee', paddingLeft: 24, paddingRight: 24, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#666' }}>{'取消'}</Text></View>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={this.onConfirmPress}>
                            <View style={{ height: 40, borderRadius: 8, backgroundColor: '#0081d4', paddingLeft: 24, paddingRight: 24, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fff', }}>{'确定'}</Text></View>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                    </View>
                </View>
            </View>
        </Modal>)
    }
}
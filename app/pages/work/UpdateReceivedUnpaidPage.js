import React, { Component, } from 'react';
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
    FlatList,
    TouchableHighlight,
    Alert,
    Platform
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as NumberUtils from '../../utils/NumberUtils'
import ImageView from '../../components/ImageView'
const WINDOW_WIDTH = Dimensions.get('window').width;
import { NavigationActions } from 'react-navigation'
import { Iconfont, Toast, FetchManger, LoginInfo } from 'react-native-go';
import Spinner from 'react-native-loading-spinner-overlay';
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
/**
 * 已收未付保存
 */
class UpdateReceivedUnpaidPage extends React.Component {
    constructor(props) {
        super(props);

        this.renderFooter = this.renderFooter.bind(this)
        this.updateReceivedUnpaidSave = this.updateReceivedUnpaidSave.bind(this)
        const { params } = this.props.navigation.state;
        this.paid_total_sum = params.paidTotalSum
        this.state = {
            paid_total_sum : this.paid_total_sum,
            showSpinner: false
        }
    }

    //保存方法
    updateReceivedUnpaidSave(){
        const { navigation } = this.props;
        const token = LoginInfo.getUserInfo().token;
        const { params } = this.props.navigation.state;
        let unpaidSum = params.totalSum - this.state.paid_total_sum
        params.YSWF = true 
        params.unpaidSum = NumberUtils.fc(unpaidSum)
        params.paidTotalSum = this.state.paid_total_sum
        let saveParams = {};
        saveParams.token = token
        saveParams.delivery_id = params.deliveryId
        saveParams.paid_total_sum = this.state.paid_total_sum
        saveParams.unpaid_total_sum = params.unpaidSum
        this.setState({ showSpinner: true })
        FetchManger.postUri('/mobileServiceManager/deliveryNotes/updateReceivedUnpaid.page', saveParams).then((responseData) => {
            this.setState({ showSpinner: false })
            if (responseData.status === '0' || responseData.status === 0) {
                const navigationAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'BleManager', params: params })
                    ]
                })
                navigation.dispatch(navigationAction)
                Toast.show('保存成功')
            } else {
                Toast.show(responseData.msg)
            }
        }).catch((error) => {
            this.setState({ showSpinner: false })
            Toast.show('保存失败')
        })
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70 }}>
                        <ImageView style={{ width: 60, height: 60, borderWidth: 1, borderColor: '#c4c4c4' }} source={{ uri: item.image }} />
                    </View>
                    <View style={{ flex: 1,marginTop:2 }}>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        </View>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666' }}>{'售价：'}</Text>
                            <Text style={{ color: '#666' }}>{`${item.price}`}</Text>
                            <Text style={{ color: '#666' }}>{'x'}</Text>
                            <Text style={{ color: '#f80000' }}>{`${item.sale_quantity}`}</Text>
                        </View>
                        <View style={{ height: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'赠送：'}</Text>
                                <Text style={{ color: '#999' }}>{`${item.gifts_quantity}`}</Text>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ color: '#999' }}>{'总计金额：'}</Text>
                                <Text style={{ color: '#f80000',marginLeft:8 }}>¥{`${item.product_sum}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }

    renderFooter() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ padding: 8, backgroundColor: '#fff9f9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>抹零金额(元):</Text>
                        <Text style={{ color: '#f80000', marginLeft: 4 }}>¥{params.countSmallChangeSum}</Text>
                    </View>
                    <View style={{ flex: 1, height: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>实收(元):</Text>
                        <TextInput style={{ width: 100, height: 25, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            value={this.state.paid_total_sum + ''}
                            keyboardType={'numeric'}
                            onChangeText={(paid_total_sum) => {
                                paid_total_sum = paid_total_sum ? paid_total_sum : '0'
                                let num = parseFloat(paid_total_sum);
                                if (!isNaN(num)) {
                                    if (paid_total_sum.length > 1 && paid_total_sum.charAt(paid_total_sum.length - 1) === '.') {
                                        num += '.';
                                    }
                                    this.setState({ paid_total_sum: num })
                                } else {
                                    this.setState({ paid_total_sum: this.state.paid_total_sum })
                                }
                            }}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 25, flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ marginRight: 8, textAlign: 'right', }}>优惠金额(元):</Text>
                        <Text style={{ color: '#f80000' }}>¥{params.discountSum}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666' }}>铺货金额(元):</Text>
                        <Text style={{ color: '#f80000' }}>¥{params.distributionSum}</Text>
                    </View>
                </View>
            </View>)
    }

    render() {
        const { params } = this.props.navigation.state;
        let canSave = NumberUtils.FloatSub(NumberUtils.FloatAdd(NumberUtils.FloatAdd(this.state.paid_total_sum, params.discountSum)), params.totalSum) > 0
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{ backgroundColor: '#118cd7', paddingLeft: 10, paddingBottom: 4, paddingTop: 4 }}>
                    <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contacts[0].name}`}</Text>
                        <Text style={{ color: '#fff', fontSize: 16, marginLeft: 12 }}>{`${params.contacts[0].mobile1}`}</Text>
                    </View>
                    <View style={{ height: 26, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.address}`}</Text>
                    </View>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                <View style={{ flex: 1 }}>
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource.cloneWithRows(params.productLists)}
                        renderRow={this._renderItem}
                    />
                </View>
                {
                    this.renderFooter()
                }
                <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c4c4c4' }} />
                <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', height: 50 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#666' }}>{`共${params.num}件商品,总计${params.totalSum}元`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 3 }}>
                            <Text style={{ color: '#666' }}>{`押金总计￥${params.foregiftSum ? params.foregiftSum : 0}`}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={this.updateReceivedUnpaidSave} disabled={canSave}>
                        <View style={{ width: 160, height: 50, backgroundColor: canSave ? '#c4c4c4' :  '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>{`收款${this.state.paid_total_sum}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    Platform.OS === 'ios' ?
                        <KeyboardSpacer /> : null
                }
                <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>
            </View>
        );
    }
}

export default UpdateReceivedUnpaidPage;
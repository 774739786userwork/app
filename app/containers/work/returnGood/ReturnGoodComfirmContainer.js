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
  FlatList,
  Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Iconfont, LoadingView, Toast, FetchManger, LoginInfo } from 'react-native-go';
import Spinner from 'react-native-loading-spinner-overlay';

import RemarkEditeModel from './RemarkEditeModel'
import ImageView from '../../../components/ImageView'
import { NavigationActions } from 'react-navigation'
import * as NumberUtils from '../../../utils/NumberUtils'

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * 退货单 结算
 */
class ReturnGoodComfirmPage extends React.Component {
  constructor(props) {
    super(props);
    this.onConfirmPress = this.onConfirmPress.bind(this);
    this.onCancelPress = this.onCancelPress.bind(this)
    this._renderItem = this._renderItem.bind(this);
    this.dosubmitAction = this.dosubmitAction.bind(this);
    this.renderFooter = this.renderFooter.bind(this)
    this.comfirmSubmit = this.comfirmSubmit.bind(this)
    const { params } = this.props.navigation.state;
    //退款总计数量
    this.num = 0
    //退款总计金额
    this.totalSum = 0
   
    params.good_list.map((item) => {
      if (item.returnQuantity && item.returnQuantity > 0) {
        this.num += item.returnQuantity;
        this.totalSum += item.returnQuantity * item.realPrice
      }
    })

    //退货金额
    this.realReturnSum = 0;
    //抹零金额
    this.smallChangeSum = 0.0;
    var b = (this.totalSum + '').split(".");
    if (b.length > 1) {
      this.smallChangeSum = '0.' + b[1]
    }

    this.realReturnSum = b[0];
    this.smallChangeSum = NumberUtils.fc(this.smallChangeSum)

    this.state = {
      good_list: params.good_list,
      //退货原因
      returnReason: '',
      modalVisible: false,
      showSpinner: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRemarkRightPress: this.headerRemarkRightPress,
    })
  }

  headerRemarkRightPress = () => {
    this.setState({ modalVisible: true });
  }
  //退货原因 填写取消
  onCancelPress() {
    this.setState({ modalVisible: false });
  }
  //退货原因 填写确认
  onConfirmPress(content) {
    this.setState({ modalVisible: false, returnReason: content });
  }
  dosubmitAction() {
    if (this.state.returnReason) {
      Alert.alert('', '确认退货?',
        [
          { text: '确认', onPress: this.comfirmSubmit },
          { text: '取消', onPress: () => console.log('Cancel Pressed!') }
        ]
      );
    } else {
      Toast.show('请填写退货原因!')
    }

  }
  //退货 提交
  comfirmSubmit() {
    const { params } = this.props.navigation.state;
    let saveParams = {};//提交参数
    const token = LoginInfo.getUserInfo().token;
    saveParams.token = token;

    const userId = LoginInfo.getUserInfo().user_id;
    saveParams.userId = userId;

    const organizationId = LoginInfo.getUserInfo().organization_id;
    saveParams.organizationId = organizationId;

    const orgPinyin = LoginInfo.getUserInfo().org_pinyin;
    saveParams.orgPinyin = orgPinyin;

    let customerId = params.contactId[1] //客户ID
    saveParams.customerId = customerId;

    let carId = params.car_id[1] //车牌ID
    saveParams.carId = carId;

    let carNumber = params.car_id[0]  //车牌号
    saveParams.carNumber = carNumber;

    let storeHouseId = params.storehouse_id[1];//仓库id
    saveParams.storeHouseId = storeHouseId;

    let returnDate = params.loadingbill_date[0]//退货日期
    saveParams.returnDate = returnDate;

    let sourceEquipment = 1;//来源设备
    saveParams.sourceEquipment = 1;

    let returnType = params.returnType//退货类型
    saveParams.returnType = returnType;

    let totalSum = this.totalSum;//退货总计金额
    saveParams.totalSum = totalSum;

    let smallChangeSum = this.smallChangeSum;//抹零金额
    saveParams.smallChangeSum = smallChangeSum;

    let realReturnSum = this.realReturnSum;//实退金额
    saveParams.realReturnSum = realReturnSum;

    let returnReason = this.state.returnReason;//退货原因
    saveParams.returnReason = returnReason;

    let good_list = this.state.good_list; //产品列表
    saveParams.good_list = JSON.stringify(good_list);
    this.setState({ showSpinner: true })

    const { navigation } = this.props;
    FetchManger.postUri('mobileServiceManager/returnmanage/addReturnLists.page', saveParams).then((responseData) => {
      this.setState({ showSpinner: false })
      if (responseData.status === '0' || responseData.status === 0) {
        const navigationAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
          ]
        })
        navigation.dispatch(navigationAction)
        Toast.show('保存成功')
      } else {
        Toast.show(responseData.msg)
      }
    }).catch((error) => {
      console.log(error)
      this.setState({ showSpinner: false })
      Toast.show('保存失败')
    })
  }

  _renderItem = (item, index) => {
    item.productSum = item.returnQuantity * item.realPrice
    return (
      <View style={{ backgroundColor: '#fff' }} key={`row_${index}`} >
        <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
            <ImageView style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={{ uri: item.productImage }} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 34, paddingLeft: 10, marginBottom: 8, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#333', fontSize: 16 }}>{item.productName}</Text>
            </View>
            <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: '#666' }}>{'退货价：'}</Text>
                <Text style={{ color: '#666' }}>{item.realPrice}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: '#666' }}>{'押金：'}</Text>
                <Text style={{ color: '#666' }}>{`${item.foregift}`}</Text>
              </View>
            </View>
            <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: '#666' }}>{'总计：'}</Text>
                <Text style={{ color: '#f80000' }}>{item.productSum}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: '#666' }}>{'数量小计：'}</Text>
                <Text style={{ color: '#666' }}>{`${item.returnQuantity}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: '#c4c4c4' }} />
      </View>)
  }


  renderFooter() {
    return (
      <View style={{ padding: 10, backgroundColor: '#fff9f9' }}>
        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <Text style={{ color: '#f80000' }}>{`共退20件产品,总计金额:669元`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#666' }}>{`抹零金额`}</Text>
            <Text style={{ color: '#666' }}>¥{`：${this.smallChangeSum}`}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#666' }}>{`实退金额`}</Text>
            <Text style={{ color: '#666' }}>¥{`：${this.realReturnSum}`}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <Text style={{ color: '#f80000' }}>{`退货原因:${this.state.remark}`}</Text>
        </View>
      </View>)
  }

  render() {
    const { params } = this.props.navigation.state;
    let canSave = NumberUtils.FloatSub(NumberUtils.FloatAdd(NumberUtils.FloatAdd(this.state.paid_total_sum, this.state.discount_sum), (this.state.isOpenChange ? this.small_change_sum : 0)), this.total_sum) > 0
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <View style={{ backgroundColor: '#118cd7', paddingLeft: 12, paddingBottom: 6, paddingTop: 6 }}>
          <View style={{ height: 26, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contactId[2]}`}</Text>
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 12 }}>{`${params.contactId[3]}`}</Text>
          </View>
          <View style={{ height: 26, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>{`${params.contactId[4]}`}</Text>
          </View>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
        <View style={{ flex: 1 }}>
          <ListView
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRows(params.good_list)}
            renderRow={this._renderItem}
          />
        </View>
        <View style={{ padding: 10, backgroundColor: '#fff9f9' }}>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>{`共退${this.num}件产品,总计金额:${this.totalSum}元`}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ color: '#666' }}>{`抹零金额`}</Text>
              <Text style={{ color: '#666' }}>¥{`：${this.smallChangeSum}`}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ color: '#666' }}>{`实退金额`}</Text>
              <Text style={{ color: '#666' }}>¥{`：${this.realReturnSum}`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>{`退货原因:${this.state.returnReason}`}</Text>
          </View>
        </View>
        <View style={{ height: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.dosubmitAction}>
            <View style={{ flex: 1, width: WINDOW_WIDTH, backgroundColor: '#fe6732', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>{`确认退货`}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <RemarkEditeModel content={this.state.remark} modalVisible={this.state.modalVisible} onCancelPress={this.onCancelPress} onConfirmPress={this.onConfirmPress} />
        <View><Spinner visible={this.state.showSpinner} text={'提交中,请稍后...'} /></View>
      </View >
    );
  }
}


class ReturnGoodComfirmContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: ` 退货确认`,
      headerRight: (<TouchableOpacity onPress={() => {
        navigation.state.params.headerRemarkRightPress();
      }}>
        <View style={{ marginRight: 8 }}>
          <Iconfont
            label={'退货原因'}
            labelSize={16}
            labelColor={'#fff'}
          />
        </View>
      </TouchableOpacity>)
    };
  };


  render() {
    return <ReturnGoodComfirmPage {...this.props} />;
  }
}


export default ReturnGoodComfirmContainer;

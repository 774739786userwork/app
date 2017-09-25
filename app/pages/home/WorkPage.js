
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  Image,
  StyleSheet,
  InteractionManager,
  TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-swiper'
import NavigationUtil from '../../utils/NavigationUtil';
import GridView from '../../components/GridView';
import HomeBar from '../../components/HomeBar'
import { Iconfont, Toast } from 'react-native-go';

const WINDOW_WIDTH = Dimensions.get('window').width;

const HomeItem = [
  { name: '提货单', open: true, typeName: 'SelectLadingbills', image: require('../../imgs/home/tihuo_order.png') },
  { name: '送货单', open: true, typeName: 'SelectDeliveryOrder', image: require('../../imgs/home/songhuo_order.png') },
  { name: '订货单', open: true, typeName: 'PurchaseOrderInfo', image: require('../../imgs/home/dinghuo_order.png') },
  { name: '车存货单', open: true, typeName: 'GetCarstockProductList', image: require('../../imgs/home/cunhuo.png') },
  { name: '车余货单', open: true, typeName: 'GetCarSurplusGoodsList', image: require('../../imgs/home/yuhuo_order.png') },
  { name: '卸货单', open: true, typeName: 'UnLoadBillDetailList', image: require('../../imgs/home/xiehuo_order.png') },
  { name: '退货单', open: true, typeName: 'QueryReturnLists', image: require('../../imgs/home/tuihuo_order.png') },
  { name: '开提货单', open: true, typeName: 'AddLadingbills', image: require('../../imgs/home/add_tihuo_order.png') },
  { name: '开送货单', open: true, typeName: 'ListCustomers', image: require('../../imgs/home/add_songhuo_order.png') },
  { name: '开退货单', open: true, typeName: 'NewReturnGood', image: require('../../imgs/home/add_tuihuo_order.png') },
  { name: '开订货单', open: true,typeName: 'PurchaseOrder', image: require('../../imgs/home/kaidinghuodan.png') },
  //  { name: '结算单', open: false, typeName: 'AddBalanceAccouts', image: require('../../imgs/home/jiesuandan.png') },
  //  { name: '欠款单', open: true, typeName: 'GetDebtPayNoteList', image: require('../../imgs/home/qiankuandan.png') }
];

const styles = {
  wrapper: {
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width: WINDOW_WIDTH,
    flex: 1,
    backgroundColor: 'transparent'
  },

  loadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },

  loadingImage: {
    width: 60,
    height: 60
  },
  gridview: {
  },
  itembtnview: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH / 3,
    height: WINDOW_WIDTH / 3,
    borderBottomColor: '#dedede',
    borderRightColor: '#dedede',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth
  },
  showText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
}
const Slide = props => {
  return (<View style={styles.slide} key={'b_image_' + props.i}>
    <TouchableOpacity
      activeOpacity={1}
      style={{ flex: 1 }}
      onPress={props.onSlideAction}
    >
      <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={require('../../imgs/ic_default.png')} />
      {
        !props.loaded && <View style={styles.loadingView} />
      }
    </TouchableOpacity>
  </View>)
}

class WorkPage extends React.Component {

  constructor(props) {
    super(props)
    this._onMenuClick = this._onMenuClick.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.loadHandle = this.loadHandle.bind(this)
    this.onRightButtonPress = this.onRightButtonPress.bind(this)

    this.state = {
      imgList: [
        '',
        '',
      ],
      loadQueue: [0, 0, 0, 0],
      swiperShow: false
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        swiperShow: true
      });
    }, 0)
  }

  onSlideAction() {
    const { navigate } = this.props.navigation;
    navigate('WebView');
  }


  loadHandle(i) {
    let loadQueue = this.state.loadQueue
    this.setState({
      loadQueue
    })
  }
  _onMenuClick(item) {
    const { navigate } = this.props.navigation;
    if (!item.open) {
      Toast.show('该功能还未开放')
      return
    }
    navigate(item.typeName);
  }
  _renderItem(item, index) {
    return (
      <TouchableHighlight underlayColor='#C8C7CC' onPress={() => this._onMenuClick(item)} key={index}>
        <View style={styles.itembtnview}>
          <Image style={{ width: 42, height: 42 }} source={item.image} />
          <Text style={styles.showText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
  onRightButtonPress() {
    const { navigate } = this.props.navigation;
    navigate('QR');
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <HomeBar title='多邦建筑装饰材料' onRightButtonPress={this.onRightButtonPress} rightView={() => (<Iconfont icon='e6a8' iconSize={24} label={'扫'} labelColor={'#0081d4'} />)} />
        {
          this.state.swiperShow ? <Swiper
            nextButton={<Text style={{
              fontSize: 50,
              color: '#c4c4c4',
              fontFamily: 'Arial'
            }}>›</Text>}
            prevButton={<Text style={{
              fontSize: 50,
              color: '#c4c4c4',
              fontFamily: 'Arial'
            }}>‹</Text>}
            loadMinimal
            loadMinimalSize={1}
            showsPagination={false}
            style={styles.wrapper}
            height={134}
            loop={true}
            showsButtons={true}
            autoplay={true}>
            {
              this.state.imgList.map((item, i) => <Slide
                loadHandle={this.loadHandle}
                onSlideAction={this.onSlideAction.bind(this)}
                loaded={!!this.state.loadQueue[i]}
                uri={item}
                i={i}
                key={i} />)
            }
          </Swiper> : null
        }
        <View style={{ height: 12, backgroundColor: '#f2f2f2' }} />
        <GridView
          style={styles.gridview}
          items={Array.from(HomeItem)}
          itemsPerRow={3}
          renderItem={this._renderItem}
        />
      </View >
    );
  }
}

export default WorkPage;


import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  Image,
  StyleSheet
} from 'react-native';

import Swiper from 'react-native-swiper'

import GridView from '../../components/GridView';
import HomeBar from '../../components/HomeBar'
import Iconfont from '../../reactgo/Iconfont';

const WINDOW_WIDTH = Dimensions.get('window').width;
const loading = require('../../imgs/loading.gif')

const HomeItem = [
  { name: '开提货单', type: null, typeName: '', image: require('../../imgs/home/add_tihuo_order.png') },
  { name: '送货单', type: null, typeName: '', image: require('../../imgs/home/songhuo_order.png') },
  { name: '订货单', type: null, typeName: '', image: require('../../imgs/home/dinghuo_order.png') },
  { name: '开销货单', type: null, typeName: '', image: require('../../imgs/home/add_xiaohuo_order.png') },
  { name: '退货处理单', type: null, typeName: '', image: require('../../imgs/home/tuihuochuli_order.png') },
  { name: '退货单', type: null, typeName: '', image: require('../../imgs/home/tuihuo_order.png') },
  { name: '开余货单', type: null, typeName: '', image: require('../../imgs/home/add_yuhuo_order.png') },
  { name: '卸货单', type: null, typeName: '', image: require('../../imgs/home/xiehuo_order.png') },
];

const styles = {
  wrapper: {
    backgroundColor:'red'
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
    backgroundColor: 'rgba(0,0,0,.5)'
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
  return (<View style={styles.slide}>
    <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={{ uri: props.uri }} />
    {
      !props.loaded && <View style={styles.loadingView}>
        <Image style={styles.loadingImage} source={loading} />
      </View>
    }
  </View>)
}

class WorkPage extends React.Component {

  constructor(props) {
    super(props)
    this._onMenuClick = this._onMenuClick.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.loadHandle = this.loadHandle.bind(this)

    this.state = {
      imgList: [
        'https://gitlab.pro/yuji/demo/uploads/d6133098b53fe1a5f3c5c00cf3c2d670/DVrj5Hz.jpg_1',
        'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
        'https://gitlab.pro/yuji/demo/uploads/4421f77012d43a0b4e7cfbe1144aac7c/XFVzKhq.jpg',
        'https://gitlab.pro/yuji/demo/uploads/576ef91941b0bda5761dde6914dae9f0/kD3eeHe.jpg'
      ],
      loadQueue: [0, 0, 0, 0]
    }
  }
  loadHandle(i) {
    let loadQueue = this.state.loadQueue
    this.setState({
      loadQueue
    })
  }
  _onMenuClick(item) {

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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <HomeBar title='多邦建筑装饰材料' navigator={this.props.navigator} rightView={() => (<Iconfont icon='e6a8' iconSize={24} label={'扫'} labelColor={'#0081d4'} />)} />
        <Swiper loadMinimal loadMinimalSize={1} style={styles.wrapper} height={134} loop={false}>
          {
            this.state.imgList.map((item, i) => <Slide
              loadHandle={this.loadHandle}
              loaded={!!this.state.loadQueue[i]}
              uri={item}
              i={i}
              key={i} />)
          }
        </Swiper>
        <View style={{height:12,backgroundColor:'#f2f2f2'}}/>
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

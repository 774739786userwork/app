/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
//加载组件
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Navigator,
  Image,
  PixelRatio,
  PropTypes,
  TouchableHighlight,
  View
} from 'react-native';

import Iconfont from '../reactgo/Iconfont';

class ListItemSetting extends Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableHighlight
        underlayColor='#C8C7CC'
        {...this.props}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Iconfont fontFamily={'OAIndexIcon'}
              icon={this.props.icon} // 图标
              iconColor={this.props.iconColor}
              iconSize={22}
              />
          </View>
          <Text style={styles.titles}>{this.props.showText}</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.rightImg}>
            {
              this.props.value ? <Text style={{marginRight:8}}>{this.props.value}</Text> : <Iconfont fontFamily={'OAIndexIcon'}
                icon='e657' // 图标
                iconColor='#a3a3a3'
                iconSize={20}
                />
            }

          </View>
        </View>

      </TouchableHighlight>
    );
  }



}
//创建list组件


//添加样式表，采用外联样式
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderColor: '#D4D4D4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 48,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  left: {
    marginLeft: 16,
  },
  rightImg: {
    alignItems: 'center',
    marginRight: 8,
  },
  titles: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
});


module.exports = ListItemSetting;


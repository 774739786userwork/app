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
  InteractionManager
} from 'react-native';

import HomeBar from '../../components/HomeBar'
import { Iconfont } from 'react-native-go';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const HomeItem = [
  { name: '我的销售情况', type: '', classType: null, icon: 'e6bb', iconColor: '#f72e64', iconSize: 20 },
  { name: '日结单', type: '', classType: null, icon: 'e6ad', iconColor: '#18c5c1', iconSize: 24 },
  { name: '产品分析', type: '', classType: null, icon: 'e742', iconColor: '#f8ae0f', iconSize: 26 },
  { name: '欠收款', type: '', classType: null, icon: 'e6bc', iconColor: '#3abaf9', iconSize: 20 },
];

//添加样式表，采用外联样式
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderColor: '#D4D4D4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 64,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  left: {
    marginLeft: 16,
  },
  rightImg: {
    marginRight: 8,
  },
  titles: {
    fontSize: 15,
    color: '#000',
    marginLeft: 8,
  },
});

var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class SelasPage extends React.Component {
  constructor(props) {
    super(props);
    this._renderRowView = this._renderRowView.bind(this);
    this._pressRow = this._pressRow.bind(this);

  }
  _pressRow(rowData) {
  }
  _renderRowView(rowData, sectionId, rowID) {
    return (<TouchableHighlight
      underlayColor='#C8C7CC'
      key={`rowID_${rowID}`}
      onPress={this._pressRow.bind(this, rowData)}>
      <View style={styles.row}>
        <View style={[styles.left, {
          backgroundColor: rowData.iconColor,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }]}>
          <View style={{
            marginLeft: 2,
            marginTop: 1
          }}>
            <Iconfont fontFamily={'OAIndexIcon'}
              icon={rowData.icon} // 图标
              iconColor='#fff'
              iconSize={rowData.iconSize}
            />
          </View>
        </View>
        <Text style={styles.titles}>{rowData.name}</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.rightImg}>
          <Iconfont fontFamily={'OAIndexIcon'}
            icon='e657' // 图标
            iconColor='#a3a3a3'
            iconSize={20}
          />
        </View>
      </View>
    </TouchableHighlight>);

  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <HomeBar title='销售管理' navigator={this.props.navigator} />
        <View style={{ flex: 1 }}>
          <ListView
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRows(HomeItem)}
            renderRow={this._renderRowView}
          />
        </View>
      </View >
    );
  }
}

export default SelasPage;

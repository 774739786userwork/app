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
  { name: '客户关系', type: 'AddCust', classType: null, icon: 'e6b7', iconColor: '#8855fa', iconSize: 24 },
  { name: '我的客户', type: 'AddCust', classType: null, icon: 'e6be', iconColor: '#fc2e9d', iconSize: 24 },
  { name: '新增客户', type: 'AddCust', classType: null, icon: 'e6b8', iconColor: '#18c5c1', iconSize: 24 },
  { name: '客户联系人', type: 'AddCust', classType: null, icon: 'e70e', iconColor: '#f8ae0f', iconSize: 24 },
  { name: '客户进货记录', type: 'AddCust', classType: null, icon: 'e6a9', iconColor: '#3abaf9', iconSize: 24 },
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

class CustPage extends React.Component {
  constructor(props) {
    super(props);
    this._renderRowView = this._renderRowView.bind(this);
    this._pressRow = this._pressRow.bind(this);

  }
  _pressRow(item) {
    const { navigate } = this.props.navigation;
    navigate(item.type);
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
        <HomeBar title='客户管理' navigator={this.props.navigator} />
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

export default CustPage;

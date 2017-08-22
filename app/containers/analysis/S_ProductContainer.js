import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
  InteractionManager,
  ScrollView,
  TouchableOpacity,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';

import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LeftTabComponet from './LeftTabComponet'
import ImageView from '../../components/ImageView'

import TableRow from './TableRow'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.goToPage = this.goToPage.bind(this)
    this.onListItemAction = this.onListItemAction.bind(this)
    this.state = {
      activeTab: 0,
      data: [],
      selectItem: undefined
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getDayFactory.page', {}).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data.dayList;
          this.setState({ data })
        }
      }).catch((error) => {

      })
    });
  }

  goToPage(activeTab) {
    this.setState({ activeTab })
  }
  renderTabBar() {
    let activeTab = this.state.activeTab
    let color0 = activeTab == 0 ? "#fff" : "#0081d4";
    let tColor0 = activeTab == 0 ? "#0081d4" : "#fff";
    let color1 = activeTab == 1 ? "#fff" : "#0081d4"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor1 = activeTab == 1 ? "#0081d4" : "#fff";

    return (
      <View style={{
        height: 48, backgroundColor: '#0081d4', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', elevation: 5,
      }}>
        <View style={{ flex: 1 }} />
        <View style={styles.tabs}>
          <TouchableWithoutFeedback onPress={() => this.goToPage(0)} style={styles.tab}>
            <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
              <Text style={{ color: tColor0 }}>
                年
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.goToPage(1)} style={styles.tab}>
            <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
              <Text style={{ color: tColor1 }}>
                月
							</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );

  }
  onItemAction() {

  }
  onListItemAction() {
    const { navigation } = this.props;
    navigation.navigate('S_ProductDetail')
  }
  render() {
    let iosTop = Platform.OS === 'ios' ? 20 : 0;

    let listData = this.state.data;
    let selectItem = this.state.selectItem;
    if (!selectItem) {
      selectItem = {}
      if (listData[0]) {
        selectItem = listData[0].salerList[0]
      }
    }
    let factoryList = [];
    if (selectItem && selectItem.factoryList) {
      factoryList = selectItem.factoryList
    }

    return (<View style={{ flex: 1 }}>
      <View style={{ height: iosTop, backgroundColor: '#0081d4' }} />
      {
        this.renderTabBar()
      }
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
        <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LeftTabComponet
            data={listData}
            sectionAction={(item) => {
              this.setState({ selectItem: item.salerList[0] })
            }}
          />
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
          <View style={{ backgroundColor: '#fff', margin: 12, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemAction}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ padding: 12, color: '#333' }}>{'销量上升'}</Text>
                <View style={{ flex: 1 }} />
                <Iconfont icon='e6cf' iconSize={16} iconColor={'#333'} />
              </View>
            </TouchableOpacity>
            <View style={{ width: 12, backgroundColor: '#f9f9f9', }} />
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemAction}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ padding: 12, color: '#333' }}>{'销量下降'}</Text>
                <View style={{ flex: 1 }} />
                <Iconfont icon='e74f' iconSize={16} iconColor={'#333'} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#fff', marginLeft: 12, marginRight: 12, marginBottom: 12 }}>
            <DetailList onItemAction={this.onListItemAction} />
          </View>
        </ScrollView>
      </View >
    </View >
    );
  }

}
//详细列表
class DetailList extends React.Component {
  constructor(props) {
    super(props)
    this._renderSeperator = this._renderSeperator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.onItemAction = this.onItemAction.bind(this);
  }
  onItemAction() {
    this.props.onItemAction && this.props.onItemAction();
  }
  _renderRow(rowData, rowID) {
    return <TouchableOpacity onPress={this.onItemAction} key={`index_${rowID}`}>
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ImageView source={{ uri: '' }} style={{ width: 50, height: 50, margin: 2 }} />
        </View>
        <View style={{ marginLeft: 6, flex: 1, justifyContent: 'center' }}>
          <Text style={{ flex: 1, color: '#666' }}>{'内墙环保部'}</Text>
          <Text style={{ flex: 1, color: '#666' }}>{'内墙环保部'}</Text>
        </View>
      </View>
    </TouchableOpacity>;
  }
  _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }}
      />
    );
  }
  render() {
    let data = ['广东体彩', '广东体彩', '广东体彩', '广东体彩', '广东体彩'];
    return <View>
      <ListView
        dataSource={ds.cloneWithRows(data)}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeperator}
        showsVerticalScrollIndicator={false}
      />
    </View>;
  }
}


class S_ProductContainer extends React.Component {
  static navigationOptions = {
    title: '产品',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e724' iconSize={24} iconColor={tintColor} />
    ),
  };

  render() {
    return <S_SeriesPage {...this.props} />;
  }
}


const styles = StyleSheet.create({
  tabs: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 180,
    flexDirection: 'row',
  },
  tab: {
    height: 30,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem0: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 34,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,

  },
  tabItem1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 34,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

});

export default S_ProductContainer;

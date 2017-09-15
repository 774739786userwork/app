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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LeftTabComponet from './LeftTabComponet'
import ImageView from '../../components/ImageView'
import LoadingListView from '../../components/LoadingListView'

import TableRow from './TableRow'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.onListItemAction = this.onListItemAction.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onItemAction = this.onItemAction.bind(this);
    this.onItemUpAction = this.onItemUpAction.bind(this);
    this.state = {
      loading: false,
      activeTab: 0,
      salerList: [],
      selectItem: {}
    }
  }

  componentDidMount() {
    let key = this.props.tabLabel;
    let up = 'rise';
    this.loadData(key,up);
  }
  loadData(type,up) {
    let param = { type: type, salerSort: up };
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearMonthProductSaler.page', param,30*60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let salerList = responseData.salerList;
          this.setState({ salerList })
        }
      }).catch((error) => {

      })
    });
  }
  
  //销量上升
  onItemUpAction(){
    let key = this.props.tabLabel;
    let up = 'rise';
    this.loadData(key,up)
  }

  //销量下降
  onItemAction() {
    let key = this.props.tabLabel;
    let down = 'fall';
    this.loadData(key,down)
  }
  onListItemAction(rowData) {
    const { navigation,tabLabel } = this.props;
    let salerList = this.state.salerList;
    let _selectItem = null;
    if (!this.state.selectItem.productList && salerList.length > 0) {
      _selectItem = salerList[0];
    } else {
      _selectItem = this.state.selectItem;
    }
    let param = {productId:rowData.productId,factoryId:_selectItem.factoryId,type:tabLabel};
    navigation.navigate('S_ProductDetail',param)
  }
  render() {
    let iosTop = Platform.OS === 'ios' ? 20 : 0;

    let salerList = this.state.salerList;
    let _selectItem = null;
    if (!this.state.selectItem.productList && salerList.length > 0) {
      _selectItem = salerList[0];
    } else {
      _selectItem = this.state.selectItem;
    }

    return (<View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
        <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LeftTabComponet
            data={salerList}
            sectionAction={(item) => {
              this.setState({ selectItem: item })
            }}
          />
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
          <View style={{ backgroundColor: '#fff', margin: 12, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemUpAction}>
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
          <View style={{ backgroundColor: '#fff', flex: 1, marginLeft: 12, marginRight: 12, marginBottom: 12 }}>
            <DetailList listData={_selectItem.productList} onItemAction={this.onListItemAction} />
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
    this.state = {
      loading: false,
    }
  }
  onItemAction(rowData) {
    this.props.onItemAction && this.props.onItemAction(rowData);
  }
  _renderRow(rowData, rowID) {
    return <TouchableOpacity onPress={this.onItemAction.bind(this,rowData)} key={`index_${rowID}`}>
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ImageView source={{ uri: rowData.productImage }} style={{ width: 50, height: 50, margin: 2 }} />
        </View>
        <View style={{ marginLeft: 6, flex: 1, justifyContent: 'center' }}>
          <Text style={{ flex: 1, color: '#666' }}>{rowData.productName}</Text>
          <Text style={{ flex: 1, color: '#666' }}>{`环比占比 ${rowData.increase}`}</Text>
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
    let data = this.props.listData;
    if (!data) {
      data = [];
    }
    return <View style={{ flex: 1 }}>
      <LoadingListView
        loading={this.state.loading}
        listData={ds.cloneWithRows(data)}
        renderRowView={this._renderRow} />
    </View>;
  }
}


class S_ProductContainer extends React.Component {
  static navigationOptions = {
    title: '产品',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6d0' iconSize={24} iconColor={tintColor} />
    ),
  };

  renderTabBar(tab) {
    let color0 = tab.activeTab == 0 ? "#fff" : "#0081d4";
    let tColor0 = tab.activeTab == 0 ? "#0081d4" : "#fff";
    let color1 = tab.activeTab == 1 ? "#fff" : "#0081d4"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor1 = tab.activeTab == 1 ? "#0081d4" : "#fff";
    return (
      <View style={{
        height: 48, backgroundColor: '#0081d4', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', elevation: 5,
      }}>
        <View style={{ flex: 1 }} />
        <View style={styles.tabs}>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(0)} style={styles.tab}>
            <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
              <Text style={{ color: tColor0 }}>
                年
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(1)} style={styles.tab}>
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

  render() {
    let iosTop = Platform.OS === 'ios' ? 20 : 0;
    return (<View style={{ flex: 1 }}>
      <View style={{ height: iosTop, backgroundColor: '#0081d4' }} />
      <ScrollableTabView renderTabBar={this.renderTabBar} >
        <S_SeriesPage key={'0'} {...this.props} tabLabel={'0'} />
        <S_SeriesPage key={'1'}  {...this.props} tabLabel={'1'} />
      </ScrollableTabView>
    </View>)
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

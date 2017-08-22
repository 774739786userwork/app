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

import TableRow from './TableRow'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.goToPage = this.goToPage.bind(this)
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
                <Text style={{ padding: 12, }}>{'全部产品'}</Text>
                <View style={{ flex: 1 }} />
                <Iconfont icon='e686' iconSize={16} iconColor={'#333'} />
              </View>
            </TouchableOpacity>
            <View style={{ width: 12, backgroundColor: '#f9f9f9', }} />
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemAction}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ padding: 12, }}>{'全部'}</Text>
                <View style={{ flex: 1 }} />
                <Iconfont icon='e686' iconSize={16} iconColor={'#333'} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12, padding: 12 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ color: '#666', fontSize: 12, width: 80 }}>{'本月目标任务'}</Text>
              <Text style={{ color: '#000', fontSize: 12 }}>{`200万`}</Text>
            </View>
            <View style={{ flex: 1, marginTop: 8, flexDirection: 'row' }}>
              <Text style={{ color: '#666', fontSize: 12, width: 80 }}>{'当前完成'}</Text>
              <Text style={{ color: '#000', fontSize: 12 }}>{`200万`}</Text>
            </View>
            <View style={{ flex: 1, marginTop: 8, flexDirection: 'row' }}>
              <Text style={{ color: '#666', fontSize: 12, width: 80 }}>{'完成销量'}</Text>
              <Text style={{ color: '#000', fontSize: 12 }}>{`200万`}</Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12 }}>
            <TableRow bg={'#17c6c1'} tColor={'#fff'} t0={'工厂'} t1={'人数'} t2={'占比'} />
            {
              factoryList.map((item) => <TableRow bg={'#fff'} tColor={'#666'} t0={item.orgName} t1={item.personNumber} t2={item.proportion} key={`index_${item.orgName}`}/>)
            }
          </View>
          <View style={{ backgroundColor: '#fff', margin: 12 }}>
            <DetailList />
          </View>
        </ScrollView>
      </View >
    </View >
    );
  }

  renderList() {

  }
}
//详细列表
class DetailList extends React.Component {
  constructor(props) {
    super(props)
    this.onItemAction = this.onItemAction.bind(this);
    this._renderSeperator = this._renderSeperator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      selectItem: 0
    }
  }
  onItemAction(item, index) {
    this.setState({ selectItem: index })
  }
  _renderRow(rowData, rowID) {
    return <View style={{ padding: 12 }}>
      <Text>{`${rowData}`}</Text>
    </View>;
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
    let data = ['广东体彩','广东体彩','广东体彩','广东体彩','广东体彩'];
    let itemArr = ['产品', '客户', '业务员'];
    let selectIndex = this.state.selectItem;
    return <View>
      <View style={{ backgroundColor: '#fff', margin: 12, flexDirection: 'row' }}>
        {
          itemArr.map((item, index) => <TouchableOpacity onPress={this.onItemAction.bind(this, item, index)} key={`index_${index}`}>
            <View style={{ width: 60, flexDirection: 'row' }} key={`index_${index}`}>
              <Text style={{ color: index === selectIndex ? '#0081d4' : '#222' }}>{`${item}`}</Text>
            </View>
          </TouchableOpacity>)
        }
        <View style={{ flex: 1, backgroundColor: '#fff', }} />
      </View>
      <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
        {
          itemArr.map((item, index) => <View
            style={{
              width: 60,
              height: 1,
              backgroundColor: index === selectIndex ? '#0081d4' : '#d9d9d9'
            }} key={`index_sub_${index}`} />)
        }
        <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9d9', }} />
      </View>
      <ListView
        dataSource={ds.cloneWithRows(data)}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeperator}
        showsVerticalScrollIndicator={false}
      />
    </View>;
  }
}


class S_SeriesContainer extends React.Component {
  static navigationOptions = {
    title: '系列',
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


export default S_SeriesContainer;

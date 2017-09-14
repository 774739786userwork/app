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

import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view';

import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LeftProductTabComponet from './LeftProductTabComponet'

import TableRow from './TableRow'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.goToPage = this.goToPage.bind(this);
    this._renderRow = this._renderRow.bind(this);
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
    let color0 = activeTab == 0 ? "#f2f2f2" : "#fff";
    let tColor0 = activeTab == 0 ? "#0081d4" : "#333";
    let color1 = activeTab == 1 ? "#f2f2f2" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
    let tColor1 = activeTab == 1 ? "#0081d4" : "#333";

    return (
      <View style={{
        height: 40, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', elevation: 5,
        marginBottom:8
      }}>
          <TouchableWithoutFeedback onPress={() => this.goToPage(0)} style={styles.tab}>
            <View style={[styles.subtabItem0, { backgroundColor: color0,flex:1 }]} >
              <Text style={{ color: tColor0 }}>
                {'汇总'}
							</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.goToPage(1)} style={styles.tab}>
            <View style={[styles.subtabItem1, { backgroundColor: color1 ,flex:1 }]} >
              <Text style={{ color: tColor1 }}>
                {'详请'}
							</Text>
            </View>
          </TouchableWithoutFeedback>
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

    let leftData = [{ factoryName: '全部' }];
    let activeTab = this.state.activeTab
    return (<View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
          <LeftProductTabComponet
            data={leftData}
            sectionAction={(item) => {
              this.setState({ selectItem: item.salerList[0] })
            }}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>

          <View style={{ margin: 10, backgroundColor: '#fff', flex: 1 }}>
            {
              this.renderTabBar()
            }
            {
              activeTab ? <DetailList key={'1'} tabLabel={'详情'} {...this.props} />
              :<TotalView key={'0'} tabLabel={'汇总'} {...this.props} factoryList={factoryList} />
                
            }
          </View>
          <View>
            <ListView
              dataSource={hl_ds.cloneWithRows(listData)}
              renderRow={this._renderRow}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View >
    </View >
    );
  }

  _renderRow(rowData, rowID) {
    return <View style={{ padding: 12 }}>
      <Text>{`${rowData.factoryName}`}</Text>
    </View>;
  }
}
class TotalView extends React.Component {
  render() {
    let factoryList = this.props.factoryList;
    if (!factoryList) {
      factoryList = [];
    }
    return <View style={{ backgroundColor: '#fff' }}>
      <TableRow bg={'#17c6c1'} tColor={'#fff'} t0={'工厂'} t1={'人数'} t2={'占比'} />
      {
        factoryList.map((item) => <TableRow bg={'#fff'} tColor={'#666'} t0={item.orgName} t1={item.personNumber} t2={item.proportion} key={`index_${item.orgName}`} />)
      }
    </View>
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
    let data = [];
    for (let i = 0; i < 3; i++) {
      data.push('广东体彩' + i);
    }
    let itemArr = ['产品', '客户', '业务员'];
    let selectIndex = this.state.selectItem;
    return <View style={{ backgroundColor: '#fff' }}>
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
  subtabItem0: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    height: 40,
  },
  subtabItem1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    height: 40,
  },

});


export default S_SeriesContainer;

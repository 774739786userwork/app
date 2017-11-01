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
import LoadingListView from '../../components/LoadingListView'
import YearPicker from '../../components/YearPicker'
import * as DateUtils from '../../utils/DateUtils'
import ImageView from '../../components/ImageView';


var detail_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class S_SaleGroupPage extends React.Component {
  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this._renderGroup = this._renderGroup.bind(this);
    this._renderBranchRow = this._renderBranchRow.bind(this);
    this._rowOnBranchPress = this._rowOnBranchPress.bind(this);
    this.loadDetail = this.loadDetail.bind(this);

    this.state = {
      dataList: [],
      branchFactoryList: [],
      selectItem: undefined,
      loading: false,
      currentDate: DateUtils.yearMonth().year
    }
  }

  componentDidMount() {
    const { navigation, tabLabel } = this.props;
    this.setState({ loading: true });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getMyFocusFactory.page', { userId: '100130' }, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          const { currentDate } = this.state;
          let orgId = undefined;
          if (data.length > 0) {
            data[0].selected = true;
            orgId = data[0].orgId;
            this.loadDetail(currentDate, orgId);
          }
          this.setState({ branchFactoryList: data, orgId, loading: false })

        } else {
          this.setState({ loading: false });
        }
      }).catch((error) => {
        this.setState({ loading: false });
      })
    });
  }
  //加载数据
  //orgId=108&type=0&currTime=2017
  loadDetail(currTime, orgId) {
    let p = { orgId, type: 0, currTime }
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getSimpleFactorySaleDetail.page', p, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          this.setState({ dataList: data, loading: false })
        } else {
          this.setState({ loading: false });
        }
      }).catch((error) => {
        this.setState({ loading: false });
      })
    });
  }
  onItemAction(item) {
    const { navigation, tabLabel } = this.props;
    let selectItem = this.state.selectItem;
    let param = { factoryId: selectItem.serieslId, orgName: selectItem.serieslName + item.orgName, seriesId: item.orgId, type: tabLabel };
    navigation.navigate('S_SeriesDetail', param)
  }
  onFactoryAction(item) {
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, factoryId: item.factoryId, factoryName: item.factoryName };
    navigation.navigate('S_SeriesDetailChart', param)
  }
  _rowOnPress(item) {
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, factoryId: item.factoryId, factoryName: item.factoryName };
    navigation.navigate('ProductSaleDetailPage', item)
  }
  _onEmployeeSaleDetailPress(item) {
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, factoryId: item.factoryId, factoryName: item.factoryName };
    navigation.navigate('EmployeeSaleDetailPage', item)
  }

  _onCustomerSaleDetailPress(item){
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, factoryId: item.factoryId, factoryName: item.factoryName };
    navigation.navigate('CustomerSaleDetailPage', item)
  }

  _renderRow(item, index) {
    return (
      <TouchableOpacity
        onPress={this._rowOnPress.bind(this, item)}
        key={`row_${index}`}
      >
        <View style={{ backgroundColor: '#fff' }} key={`row_${index}`}>
          <View style={{ flexDirection: 'row', paddingLeft: 8, }}>
            <View style={{ flex: 1 }}>
              <View style={{ height: 30, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ color: '#999', fontSize: 12 }}>{`${item.seriesName}：`}</Text>
                  <Text style={{ color: '#999', fontSize: 12 }}>{`${item.seriesSales}`}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>
      </TouchableOpacity>
    );
  }

  _renderGroup(item, sectionID, index) {
    return (
      <View key={`row_${index}`} style={{ backgroundColor: '#f9f9f9' }}>
        <View style={{ height: StyleSheet.hairlineWidth, marginTop: 8, flex: 1, backgroundColor: '#c4c4c4' }} />

        <View style={{ padding: 8, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={this._onEmployeeSaleDetailPress.bind(this, item)}
          >
            <Text style={{ color: '#333', flex: 1 }}>{item.groupName}</Text>
          </TouchableOpacity>
          <View style={{flex:1}}/>
          <TouchableOpacity
            onPress={this._onCustomerSaleDetailPress.bind(this, item)}
          >
            <Text style={{ color: '#333',marginRight: 4, }}>{`客户情况`}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30, backgroundColor: '#fff', paddingLeft: 20, paddingBottom: 4, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#f80000', fontSize: 12 }}>{`销售总额：${item.totalSum}`}</Text>
        </View>
        {
          item.seriesList.map((item, index) => {
            return this._renderRow(item, index)
          })
        }
      </View>
    );
  }
  _rowOnBranchPress(item) {
    let branchFactoryList = this.state.branchFactoryList;
    branchFactoryList.map((_item) => {
      _item.selected = false;
      if (_item.orgId === item.orgId) {
        _item.selected = true;
      }
    })
    const { startDate, endDate } = this.state;
    let orgId = item.orgId;
    // this.loadDetail(startDate, endDate, orgId);

    this.setState({ branchFactoryList, orgId })
  }
  _renderBranchRow(item, sectionID, index) {
    let selected = item.selected;
    return <TouchableOpacity
      onPress={this._rowOnBranchPress.bind(this, item)}
      key={`row_${index}`}
    >
      <View style={{ width: 120, height: 40, backgroundColor: '#fff' }}>
        <Text style={{ color: selected ? '#0081d4' : '#000', textAlign: 'center', lineHeight: 38, width: 120 }}>{item.orgName}</Text>
        <View style={{ height: 2, width: 120, backgroundColor: selected ? '#0081d4' : '#fff' }} />
      </View>
    </TouchableOpacity>
  }
  render() {
    return (<View style={{ flex: 1, backgroundColor: '#f9f9f9' }} >
      <View style={{
        paddingTop: 6,
        paddingBottom: 6,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        flexDirection: 'row'
      }}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => {

        }}>
          <Iconfont
            icon={'e688'} // 图标
            iconColor={'#aaa'}
            iconSize={26} />
        </TouchableOpacity>
        <YearPicker
          style={{ width: 120 }}
          customStyles={{
            dateText: {
              fontSize: 18,
              color: '#000',
            }
          }}
          selY={this.state.selY}
          onDateChange={(selY, ymStr) => {
            this.loadData(selY);
            this.setState({ selY })
          }}
        />
        <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {

        }}>
          <Iconfont
            icon={'e657'} // 图标
            iconColor={'#aaa'}
            iconSize={26} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={hl_ds.cloneWithRows(this.state.branchFactoryList)}
          renderRow={this._renderBranchRow}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
      <LoadingListView
        loading={this.state.loading}
        listData={ds.cloneWithRows(this.state.dataList)}
        renderRowView={this._renderGroup} />
    </View >
    );
  }


}

class S_SaleGroupContainer extends React.Component {
  static navigationOptions = {
    title: '销售组',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6bb' iconSize={22} iconColor={tintColor} />
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
              <Text style={{ color: tColor0 }}>{'年'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => tab.goToPage(1)} style={styles.tab}>
            <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
              <Text style={{ color: tColor1 }}>{'月'}</Text>
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
      <ScrollableTabView
        locked={true}
        renderTabBar={this.renderTabBar} >
        <S_SaleGroupPage key={'0'} {...this.props} tabLabel={'0'} />
        <S_SaleGroupPage key={'1'}  {...this.props} tabLabel={'1'} />
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
    flex: 1,
    height: 40,
  },
  subtabItem1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 40,
  },

});


export default S_SaleGroupContainer;
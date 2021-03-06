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
import * as DateUtils from '../../utils/DateUtils'
import YearPicker from '../../components/YearPicker'
import MonthPicker from '../../components/MonthPicker'
import AllSeriesModel from './work/productseries/AllSeriesModel'
var detail_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
var hl_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class LeftTabComponet extends React.Component {
  constructor(props) {
    super(props)
    this.renderSectionListItem = this.renderSectionListItem.bind(this);
    this.state = {
      preSelect: undefined
    }
    this.preSelect = undefined
  }
  sectionAction(item) {
    this.props.sectionAction && this.props.sectionAction(item)
    this.setState({ preSelect: item.serieslId })
  }
  renderSectionListItem(item) {
    let serieslId = item.serieslId;
    
    let preSelect = this.state.preSelect;

    if (!this.preSelect) {
      this.preSelect = serieslId
    }
    preSelect = preSelect ? preSelect : this.preSelect

    return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${serieslId}`}>
      <View>
        <View style={{ width: 100, height: 45, padding: 12, backgroundColor: preSelect != serieslId ? '#fff' : '#f9f9f9' }}>
          <Text style={{ color: preSelect != serieslId ? '#333' : '#0081d4' }}>{item.serieslName}</Text>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, width: 100, backgroundColor: '#f9f9f9' }} />
      </View>
    </TouchableOpacity>
  }
  render() {
    return <ScrollView>
      {
        this.props.data.map((item) => this.renderSectionListItem(item))
      }
    </ScrollView>
  }
}

class S_SeriesPage extends React.Component {
  constructor(props) {
    super(props);
    this._renderRow_Detail = this._renderRow_Detail.bind(this);
    this.onFactoryAction = this.onFactoryAction.bind(this);
    this.onItemUpAction = this.onItemUpAction.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
    this.state = {
      salerList: [],
      branchFactoryList: [],
      selectItem: undefined,
      loading: false,
      currentDate:DateUtils.yearMonth().year,
      userId:LoginInfo.getUserInfo().user_id,
      modelShow:false,
      selectedIds:[],
      seriesId:''
    }
  }

  componentDidMount() {
    const { currentDate,userId,seriesId } = this.state;
    this.loadDetail(currentDate,userId,seriesId);
  }

  loadDetail(currTime,userId,seriesId) {
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, userId,currTime,seriesId };
    this.setState({ loading: true });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearMonthProductSeries.page', param, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let salerList = responseData.salerList;
          let branchFactoryList = responseData.branchFactoryList;
          let selectItem = salerList[0];
          this.setState({ selectItem, salerList, branchFactoryList, loading: false })
        } else {
          this.setState({ loading: false });
        }

      }).catch((error) => {
        this.setState({ loading: false });
      })
    });
  }

  //
  onItemAction(item) {
    const { navigation, tabLabel } = this.props;
    let selectItem = this.state.selectItem;
    
    let currTime = this.state.currentDate;
    let userId = this.state.userId;
    let param = { factoryId: selectItem.serieslId,currTime:currTime,userId:userId, orgName: selectItem.serieslName + item.orgName, seriesId: item.orgId, type: tabLabel };
    navigation.navigate('S_SeriesDetail', param)
  }

  onItemUpAction(){
    this.setState({ modelShow : true})
  }

  onConfirmPress(selectedIds){
    this.setState({modelShow:false})
    const { currentDate,userId} = this.state;
    let a = selectedIds;
    let seriesId = this.state.seriesId;
    a.map((id) => {
      seriesId += id + ',';
    });
    this.loadDetail(currentDate,userId,seriesId);
  }

  onFactoryAction() {
    const { navigation, tabLabel } = this.props;
    let selectItem = this.state.selectItem;
    let currTime = this.state.currentDate;
    let param = { type: tabLabel, factoryId: selectItem.serieslId,currTime:currTime, factoryName: selectItem.serieslName };
    navigation.navigate('S_SeriesDetailChart', param)
  }
  /**
   * 

   */
  _renderRow_Detail(item, rowID) {
    return (
      <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${rowID}`}>
        <View>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.orgName}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.salerQuantity}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.proportion}`}</Text>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        </View>
      </TouchableOpacity>);
  }
  render() {
    let listData = [];
    if (this.state.selectItem) {
      listData = this.state.selectItem.factoryList;
    }
    return (<View style={{ flex: 1 }}>
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
            this.setState({ selY });
            this.state.currentDate = selY;
            this.loadDetail(this.state.currentDate,this.state.userId,this.state.seriesId);
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
      {
        this.state.loading ? <LoadingView/>
        :
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
            <View style={{ width: 90, justifyContent: 'center', alignItems: 'center' }}>
              <LeftTabComponet
                data={this.state.salerList}
                sectionAction={(item) => {
                  this.setState({ selectItem: item })
                }}
              />
            </View>
            <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
              <View style={{ backgroundColor: '#fff', marginTop: 12, marginRight: 12, marginLeft: 12, flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onFactoryAction}>
                  <View style={{ borderWidth: 1,justifyContent:'center', borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12, padding: 8, color: '#fff'}}>{`系列趋势分析`}</Text>
                  </View>
                </TouchableOpacity>
                <View style={{ width: 12, backgroundColor: '#f9f9f9', }} />
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemUpAction}>
                  <View style={{ borderWidth: 1,justifyContent:'center', borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12, padding: 8, color: '#fff' }}>{`系列交叉分析`}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ margin: 10, backgroundColor: '#fff', flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'系列'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销量'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(万)'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比%'}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <LoadingListView
                  loading={this.state.loading}
                  listData={detail_ds.cloneWithRows(listData)}
                  renderRowView={this._renderRow_Detail} />
              </View>
            </View>
            <AllSeriesModel modalVisible={this.state.modelShow} selectedIds={this.state.selectedIds}
                onCancelPress={() => { this.setState({ modelShow: false }) }}
                onConfirmPress={this.onConfirmPress}/>
          </View >
      }
    </View >
    );
  }
}

class S_SeriesMonthPage extends React.Component {
  constructor(props) {
    super(props);
    this._renderRow_Detail = this._renderRow_Detail.bind(this);
    this.onFactoryAction = this.onFactoryAction.bind(this);
    this.onItemUpAction = this.onItemUpAction.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
    let { year, month } = DateUtils.yearMonth();
    this.state = {
      selY: year, selM: month,
      salerList: [],
      branchFactoryList: [],
      selectItem: undefined,
      loading: false,
      userId:LoginInfo.getUserInfo().user_id,
      modelShow:false,
      selectedIds:[],
      seriesId:''
    }
  }

  componentDidMount() {
    let selY = this.state.selY;
    let selM = this.state.selM;
    let userId = this.state.userId;
    let month = selY + '-' + (selM < 10 ? '0' + selM : selM);
    let seriesId = this.state.seriesId;
    this.loadDetail(month,userId,seriesId);
  }

  loadDetail(currTime,userId,seriesId) {
    const { navigation, tabLabel } = this.props;
    let param = { type: tabLabel, userId,currTime,seriesId };
    this.setState({ loading: true});
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearMonthProductSeries.page', param, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let salerList = responseData.salerList;
          let branchFactoryList = responseData.branchFactoryList;
          let selectItem = salerList[0];
          this.setState({ selectItem, salerList, branchFactoryList, loading: false,groupLoading:true })
        } else {
          this.setState({ loading: false});
        }

      }).catch((error) => {
        this.setState({ loading: false});
      })
    });
  }

  onItemAction(item) {
    const { navigation, tabLabel } = this.props;
    let selectItem = this.state.selectItem;
    let selY = this.state.selY;
    let selM = this.state.selM;
    let currTime = selY + '-' + (selM < 10 ? '0' + selM : selM);
    let userId = this.state.userId;
    let param = { factoryId: selectItem.serieslId,currTime:currTime,userId:userId, orgName: selectItem.serieslName + item.orgName, seriesId: item.orgId, type: tabLabel };
    navigation.navigate('S_SeriesDetail', param)
  }

  onItemUpAction(){
    this.setState({ modelShow : true})
  }

  onConfirmPress(selectedIds){
    
    let seriesStr = selectedIds;
    let seriesId = this.state.seriesId;
    seriesStr.map((id) => {
      seriesId += id + ',';
    });
    let selY = this.state.selY;
    let selM = this.state.selM;
    let userId = this.state.userId;
    let month = selY + '-' + (selM < 10 ? '0' + selM : selM);
    this.loadDetail(month,userId,seriesId);
    this.setState({modelShow:false})
  }

  onFactoryAction() {
    const { navigation, tabLabel } = this.props;
    let selectItem = this.state.selectItem;
    let selY = this.state.selY;
    let selM = this.state.selM;
    let currTime = selY + '-' + (selM < 10 ? '0' + selM : selM);
    let param = { type: tabLabel, factoryId: selectItem.serieslId,currTime:currTime, factoryName: selectItem.serieslName };
    navigation.navigate('S_SeriesDetailChart', param)
  }
  
  /**
   * 

   */
  _renderRow_Detail(item, rowID) {
    return (
      <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${rowID}`}>
        <View>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.orgName}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.salerQuantity}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}`}</Text>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
            <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.proportion}`}</Text>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        </View>
      </TouchableOpacity>);
  }
  render() {
    let listData = [];
    if (this.state.selectItem) {
      listData = this.state.selectItem.factoryList;
    }
    return (<View style={{ flex: 1 }}>
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
        <MonthPicker
        style={{ width: 120 }}
        customStyles={{
          dateText: {
            fontSize: 18,
            color: '#000',
          }
        }}
        selY={this.state.selY}
        selM={this.state.selM}
        onDateChange={(selY, selM, ymStr) => {
          let month = selY + '-' + (selM < 10 ? '0' + selM : selM)
          this.loadDetail(month,this.state.userId,this.state.seriesId)
          this.setState({ selY, selM })
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
      {
          this.state.loading ? <LoadingView />
        :
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
          <View style={{ width: 90, justifyContent: 'center', alignItems: 'center' }}>
            <LeftTabComponet
              data={this.state.salerList}
              sectionAction={(item) => {
                this.setState({ selectItem: item })
              }}
            />
          </View>
          <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
            <View style={{ backgroundColor: '#fff', marginTop: 12, marginRight: 12, marginLeft: 12, flexDirection: 'row' }}>
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onFactoryAction}>
                <View style={{ borderWidth: 1,justifyContent:'center', borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 12, padding: 8, color: '#fff'}}>{`系列趋势分析`}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 12, backgroundColor: '#f9f9f9', }} />
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onItemUpAction}>
                <View style={{ borderWidth: 1,justifyContent:'center', borderColor: '#61aee0', flex: 1, backgroundColor: '#61aee0', borderRadius: 4, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 12, padding: 8, color: '#fff' }}>{`系列交叉分析`}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ margin: 10, backgroundColor: '#fff', flex: 1 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'系列'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销量'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(万)'}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比%'}</Text>
              </View>
              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
              <LoadingListView
                loading={this.state.loading}
                listData={detail_ds.cloneWithRows(listData)}
                renderRowView={this._renderRow_Detail} />
            </View>
          </View>
          <AllSeriesModel modalVisible={this.state.modelShow} selectedIds={this.state.selectedIds}
                onCancelPress={() => { this.setState({ modelShow: false }) }}
                onConfirmPress={this.onConfirmPress}/>
        </View >
      }
    </View >
    );
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
        <S_SeriesPage key={'0'} {...this.props} tabLabel={'0'} />
        <S_SeriesMonthPage key={'1'}  {...this.props} tabLabel={'1'} />
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


export default S_SeriesContainer;

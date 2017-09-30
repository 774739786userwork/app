import React from 'react';

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

import LoadingListView from '../../../components/LoadingListView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class ListContainer extends React.Component {

  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      loading: false,
    }
  }

  _renderRow(rowData, rowID) {
    let keyName = this.props.keyName;
    return <View key={`index_${rowID}`}>
      <View style={{borderColor:'#f2f2f2',borderWidth:StyleSheet.hairlineWidth,borderRadius:6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <View style={{ height: 34, paddingLeft: 10,  marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#333', fontSize: 16 }}>{rowData[keyName[0]]}</Text>
        </View>
        <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#999' }}>{`${keyName[1]}`}</Text>
            <Text style={{ color: '#999' }}>{`: `}</Text>
            <Text style={{ color: '#999' }}>{`${rowData[keyName[2]]}`}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: '#999'}}>{`${keyName[3]}`}</Text>
            <Text style={{ color: '#999' }}>{`: `}</Text>
            <Text style={{ color: '#999' }}>{`${rowData[keyName[4]]}`}</Text>
          </View>
        </View>
      </View>
    </View>;
  }

  render() {
    return <LoadingListView
      loading={this.props.loading}
      listData={ds.cloneWithRows(this.props.listData)}
      renderRowView={this._renderRow} />
  }

}
//系列详细列表
class S_SeriesDetailContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: ` ${navigation.state.params.orgName}`,
  });
  constructor(props) {
    super(props)
    this.onItemAction = this.onItemAction.bind(this);
    this._renderSeperator = this._renderSeperator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      productList: [],
      customerList: [],
      employeeList: []
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ loading: true });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getYearMonthProductSeriesDetails.page', params, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let productList = responseData.productList;
          let customerList = responseData.customerList;
          let employeeList = responseData.employeeList;

          this.setState({ productList, customerList, employeeList, loading: false })
        } else {
          this.setState({ loading: false });
        }

      }).catch((error) => {
        this.setState({ loading: false });
      })
    });
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
    let productKey = ['productName', '金额', 'totalSum', '销量', 'salerQuantity'];
    let customerKey = ['customerName', '金额', 'totalSum', '销量', 'salerQuantity'];
    let employerKey = ['employeeName', '金额', 'employeeSalerSum', '销量', 'employeeSalerQuantity'];
    return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollableTabView
        renderTabBar={() => (
          <DefaultTabBar tabStyle={{ paddingBottom: 0 }} textStyle={{ fontSize: 16 }} style={{ height: 40 }} />
        )}
        tabBarBackgroundColor="#fcfcfc"
        tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
        tabBarActiveTextColor="#3e9ce9"
        tabBarInactiveTextColor="#aaaaaa"
      >
        <ListContainer
          key={'0'}
          keyName={productKey}
          tabLabel={'产品'} {...this.props}
          loading={this.state.loading}
          listData={this.state.productList} />
        <ListContainer
          key={'1'}
          keyName={customerKey}
          tabLabel={'客户'} {...this.props}
          loading={this.state.loading}
          listData={this.state.customerList} />
        <ListContainer
          key={'2'}
          keyName={employerKey}
          tabLabel={'业务员'} {...this.props}
          loading={this.state.loading}
          listData={this.state.employeeList} />
      </ScrollableTabView>
    </View>);
  }
}

export default S_SeriesDetailContainer;
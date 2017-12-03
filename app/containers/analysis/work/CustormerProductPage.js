//客户产品系列
import React from 'react';
import {
    View,
    Text,
    InteractionManager,
    ListView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import LoadingListView from '../../../components/LoadingListView'
import ImageView from '../../../components/ImageView'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
/**
 * '客户产品系列'*/
class CustormerProductPage extends React.Component {
    static navigationOptions = {
        title: '客户产品系列'
    };

    constructor(props){
        super(props);
        this.state = {
            branchFactoryList:[]
        }
    }

  componentDidMount() {
    const { navigation, tabLabel } = this.props;
    let userId = LoginInfo.getUserInfo().user_id;
    this.setState({ loading: true });
    InteractionManager.runAfterInteractions(() => {
      FetchManger.getUri('dataCenter/appHomePage/getMyFocusFactory.page', { userId }, 30 * 60).then((responseData) => {
        if (responseData.status === '0' || responseData.status === 0) {
          let data = responseData.data;
          const { currentDate,orgId,orgName } = this.state;
          if (data.length > 0) {
            data[0].selected = true;
            orgId = data[0].orgId;
            orgName = data[0].orgName;
           
          }
          this.setState({ branchFactoryList: data, orgId,orgName, loading: false })

        } else {
          this.setState({ loading: false });
        }
      }).catch((error) => {
        this.setState({ loading: false });
      })
    });
  }

    render() {
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
            {
                this.state.branchFactoryList.map((item,index)=><CustomerSaleDetailPage key={index} itemId={item.orgId} tabLabel={item.orgName} {...this.props} />)
            }
            </ScrollableTabView>
        </View>);
    }
}
export default CustormerProductPage;


//查询该组或者个人客户销售情况
class CustomerSaleDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let title = state.params.currTime+state.params.groupName+'客户销售情况';

        return {
            headerTitleStyle: {fontSize: 16},
            title: title
        };
    };

    constructor(props) {
        super(props)
        this._renderRow = this._renderRow.bind(this);
        this.onItemAction = this.onItemAction.bind(this);
        this.state = {
            dataList: [],
            loading: false
        }
    }
    componentDidMount() {
         const  orgId  = this.props.itemId;
         let params = {};
         params.orgId = orgId;
         this.setState({ loading: true });
         InteractionManager.runAfterInteractions(() => {
             FetchManger.getUri('dataCenter/appHomePage/getCusSeriesCoverage.page', params, 30 * 60).then((responseData) => {
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

    }
   
    _renderRow(item, rowID) {
        return (
            <TouchableOpacity onPress={this.onItemAction.bind(this, item)} key={`index_${rowID}`}>
                <View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.customerPhone}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.seriesName}`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', color: '#666' }}>{`${item.totalSum}万元`}</Text>
                        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                        <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, width:38, textAlign: 'center', color: '#666' }}>{`${item.seriesCoverage}`}</Text>
                   
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                </View>
            </TouchableOpacity>);
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ backgroundColor: '#fff', borderColor: '#f2f2f2', borderWidth: 1, flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'客户'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'电话'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'优质系列'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'总销售额'}</Text>
                    <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                    <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, width:42, textAlign: 'center', color: '#fff' }}>{'覆盖率'}</Text>
           
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <LoadingListView
                    loading={this.state.loading}
                    listData={ds.cloneWithRows(this.state.dataList)}
                    renderRowView={this._renderRow} />
            </View>
        </View>;
    }
}


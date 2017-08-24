import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Iconfont } from 'react-native-go';

import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view';

import QueryReturnListsPage from '../../pages/work/QueryReturnListsPage';

/**
 * 退货单列表查询
 */
class QueryReturnListsContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '退货单查询',
  });

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
        <QueryReturnListsPage key={'0'} tabLabel={'退货管理'} {...this.props} />
        <QueryReturnListsPage key={'1'} tabLabel={'退空桶管理'} {...this.props} />
      </ScrollableTabView>
    </View>);
  }
}
export default QueryReturnListsContainer;

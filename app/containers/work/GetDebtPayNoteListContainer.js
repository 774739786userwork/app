import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view';

import GetDebtPayNoteListPage from '../../pages/work/GetDebtPayNoteListPage';
import QueryDebtPayNoteListPage from '../../pages/work/QueryDebtPayNoteListPage';

class GetDebtPayNoteListContainer extends React.Component {

  static navigationOptions = {
    title: '欠款单',
  };
  render() {
    return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <ScrollableTabView
            renderTabBar={() => (
                <DefaultTabBar tabStyle={{ paddingBottom: 0}} textStyle={{ fontSize: 16 }} style={{height: 40}} />
            )}
            tabBarBackgroundColor="#fcfcfc"
            tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
            tabBarActiveTextColor="#3e9ce9"
            tabBarInactiveTextColor="#aaaaaa"
        >
            <GetDebtPayNoteListPage key={'0'} tabLabel={'欠款对冲'} {...this.props} />
            <QueryDebtPayNoteListPage key={'1'} tabLabel={'欠款记录'} {...this.props} />
        </ScrollableTabView>
    </View>);
  }
}

const mapStateToProps = (state) => {
  const { getPayMentList } = state;
  return {
    getPayMentList
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
}; 
export default connect(mapStateToProps, mapDispatchToProps)(GetDebtPayNoteListContainer);

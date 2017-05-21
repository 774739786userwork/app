import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import QueryReturnListsPage from '../../pages/work/QueryReturnListsPage';

/**
 * 退货单列表查询
 */
class QueryReturnListsContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '退货单查询',
  });
  render() {
    return <QueryReturnListsPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { queryReturnLists } = state;
  return {
    queryReturnLists
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryReturnListsContainer);

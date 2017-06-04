import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import ListCustomersPage from '../../pages/work/ListCustomersPage';

/**
 * 退货单列表查询
 */
class ListCustomersContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '退货单查询',
  });
  render() {
    return <ListCustomersPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(ListCustomersContainer);

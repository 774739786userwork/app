import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import UnLoadBillDetailListPage from '../../pages/work/UnLoadBillDetailListPage';


class UnLoadBillDetailListContainer extends React.Component {
  static navigationOptions = {
    title: '卸货单查询',
  };
  render() {
    return <UnLoadBillDetailListPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const {  unLoadBillDetailList } = state;
  return {
    unLoadBillDetailList
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnLoadBillDetailListContainer);

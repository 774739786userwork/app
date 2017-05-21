import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import QueryReturnDetailPage from '../../pages/work/QueryReturnDetailPage';

/**
 * 退货单详情
 */
class QueryReturnDetailContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: ` ${navigation.state.params.customername}`,
  });
  render() {
    return <QueryReturnDetailPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { queryReturnDetail } = state;
  return {
    queryReturnDetail
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryReturnDetailContainer);

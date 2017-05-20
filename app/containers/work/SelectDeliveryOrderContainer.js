import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectDeliveryOrderPage from '../../pages/work/SelectDeliveryOrderPage';

/**
 * 送货单列表查询
 */
class SelectDeliveryOrderContainer extends React.Component {
  static navigationOptions = {
    title: '送货单查询',
  };
  render() {
    return <SelectDeliveryOrderPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { selectDeliveryOrder } = state;
  return {
    selectDeliveryOrder
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDeliveryOrderContainer);

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import DeliveryOrderDetailPage from '../../pages/work/DeliveryOrderDetailPage';

/**
 * 送货单列表查询
 */
class DeliveryOrderDetailContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: ` ${navigation.state.params.customer_name}`,
  });
  render() {
    return <DeliveryOrderDetailPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { deliveryOrderDetail } = state;
  return {
    deliveryOrderDetail
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrderDetailContainer);

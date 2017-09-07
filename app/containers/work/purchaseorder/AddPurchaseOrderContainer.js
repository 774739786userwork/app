import React from 'react';

import AddPurchaseOrderPage from './AddPurchaseOrderPage';

/**
 * 开订货单选择产品页面
 */
class AddPurchaseOrderContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '产品选择'//` ${navigation.state.params.customerName}`,
  });
  render() {
    return <AddPurchaseOrderPage {...this.props} />;
  }
}


export default AddPurchaseOrderContainer;

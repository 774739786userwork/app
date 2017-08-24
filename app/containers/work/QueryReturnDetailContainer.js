import React from 'react';

import QueryReturnDetailPage from '../../pages/work/QueryReturnDetailPage';

/**
 * 退货单详情
 */
class QueryReturnDetailContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: ` ${navigation.state.params.customerName}`,
  });
  render() {
    return <QueryReturnDetailPage {...this.props} />;
  }
}


export default QueryReturnDetailContainer;

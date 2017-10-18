import React from 'react';

import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import UpdateReceivedUnpaidPage from '../../pages/work/UpdateReceivedUnpaidPage';

/**
 * 送货单已收未付页面
 */
class UpdateReceivedUnpaidContainer extends React.Component {
  static navigationOptions = {
    title: '送货单已收未付修改',
  };
  render() {
    return <UpdateReceivedUnpaidPage {...this.props} />;
  }
}


export default UpdateReceivedUnpaidContainer;

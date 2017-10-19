import React from 'react';

import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import UpdateReceivedUnpaidPage from '../../pages/work/UpdateReceivedUnpaidPage';

/**
 * 送货单已收未付页面
 */
class UpdateReceivedUnpaidContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: ` ${navigation.state.params.customersName}`
    };
  };
  render() {
    return <UpdateReceivedUnpaidPage {...this.props} />;
  }
}


export default UpdateReceivedUnpaidContainer;

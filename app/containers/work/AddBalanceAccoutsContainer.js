import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import AddBalanceAccoutsPage from '../../pages/work/AddBalanceAccoutsPage';


class AddBalanceAccoutsContainer extends React.Component {
  static navigationOptions = {
    title: '结算单',
  };
  render() {
    return <AddBalanceAccoutsPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { addLadingbills } = state;
  return {
    addLadingbills
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBalanceAccoutsContainer);

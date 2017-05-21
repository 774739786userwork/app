import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import AddLadingbillsPage from '../../pages/work/AddLadingbillsPage';


class AddLadingbillsContainer extends React.Component {
  static navigationOptions = {
    title: '开提货单',
  };
  render() {
    return <AddLadingbillsPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(AddLadingbillsContainer);

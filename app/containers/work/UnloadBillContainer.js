import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import UnloadBillPage from '../../pages/work/UnloadBillPage';


class UnloadBillContainer extends React.Component {
  static navigationOptions = {
    title: '卸货单',
  };
  render() {
    return <UnloadBillPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const {  } = state;
  return {
    
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnloadBillContainer);

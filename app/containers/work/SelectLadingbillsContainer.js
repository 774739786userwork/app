import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectLadingbillsPage from '../../pages/work/SelectLadingbillsPage';


class SelectLadingbillsContainer extends React.Component {
  static navigationOptions = {
    title: '提货单查询',
  };
  render() {
    return <SelectLadingbillsPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { selectLadingbills } = state;
  return {
    selectLadingbills
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLadingbillsContainer);

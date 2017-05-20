import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';

import CustPage from '../pages/home/CustPage';


class CustContainer extends React.Component {
  static navigationOptions = {
    title: '客户',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6b1' iconSize={18} iconColor={tintColor} />
    )
  };

  render() {
    return <CustPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { read } = state;
  return {
    read
  };
};

const mapDispatchToProps = (dispatch) => {
  const readActions = bindActionCreators({}, dispatch);
  return {
    readActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustContainer);

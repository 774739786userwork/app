import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Iconfont from '../reactgo/Iconfont';

import SelasPage from '../pages/home/SelasPage';

class SelasContainer extends React.Component {
  static navigationOptions = {
    title: '销 售',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6ab' iconSize={24} iconColor={tintColor} />
    )
  };

  render() {
    return <SelasPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(SelasContainer);

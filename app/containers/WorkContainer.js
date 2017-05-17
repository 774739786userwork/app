import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Iconfont from '../reactgo/Iconfont';

import WorkPage from '../pages/home/WorkPage';

class WorkContainer extends React.Component {
  static navigationOptions = {
    title: '工作台',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6aa' iconSize={24} iconColor={tintColor} />
    ),
  };

  render() {
    return <WorkPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkContainer);

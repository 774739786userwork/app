import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';

import SettingPage from '../pages/home/SettingPage';


class SettingContainer extends React.Component {
  static navigationOptions = {
    title: '设置',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e677' iconSize={24} iconColor={tintColor} />
    )
  };

  render() {
    return <SettingPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);

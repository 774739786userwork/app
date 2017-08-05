import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';

import {
    View,
} from 'react-native';

class S_ProductPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>

      </View >
    );
  }
}

class S_ProductContainer extends React.Component {
  static navigationOptions = {
    title: '产品',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6d0' iconSize={20} iconColor={tintColor} />
    ),
  };

  render() {
    return <S_ProductPage {...this.props} />;
  }
}

export default S_ProductContainer;

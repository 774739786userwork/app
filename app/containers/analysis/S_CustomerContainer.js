import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
    View,
} from 'react-native';


class S_CustomerPage extends React.Component {
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

class S_CustomerContainer extends React.Component {
  static navigationOptions = {
    title: '客户',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Iconfont icon='e6aa' iconSize={24} iconColor={tintColor} />
    ),
  };

  render() {
    return <S_CustomerPage {...this.props} />;
  }
}


export default S_CustomerContainer;

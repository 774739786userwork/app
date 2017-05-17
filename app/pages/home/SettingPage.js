
import React from 'react';
import { View, Text } from 'react-native';
import HomeBar from '../../components/HomeBar'
import Iconfont from '../../reactgo/Iconfont';


class SettingPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f1f2f4' }}>
        <HomeBar title='设 置' navigator={this.props.navigator} />
        <Text ></Text>
      </View >
    );
  }
}

export default SettingPage;

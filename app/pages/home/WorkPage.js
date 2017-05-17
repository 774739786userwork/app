
import React from 'react';
import { View, Text } from 'react-native';
import HomeBar from '../../components/HomeBar'
import Iconfont from '../../reactgo/Iconfont';


class WorkPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f1f2f4' }}>
        <HomeBar title='多邦建筑装饰材料' navigator={this.props.navigator} rightView={()=>(<Iconfont icon='e6a8' iconSize={24} label={'扫'} labelColor={'#0081d4'}/>)}/>
        <Text ></Text>
      </View >
    );
  }
}

export default WorkPage;

import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import GetCarstockProductListPage from '../../pages/work/GetCarstockProductListPage';


class GetCarstockProductListContainer extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    const rightTitle = navigation.state.params ? navigation.state.params.rightTitle : '车辆选择';
    console.log(navigation.state.params)
    return {
      title: '今日余货',
      headerRight: (<TouchableOpacity onPress={() => {
        navigation.state.params.headerRightPress();
      }}>
        <View style={{ marginRight: 8 }}>
          <Iconfont
            icon={'e66e'} // 图标
            iconColor={'#fff'}
            iconSize={22}
            position={'left'}
            label={rightTitle}
            labelColor={'#fff'}
          />
        </View>
      </TouchableOpacity>)
    };
  };
  constructor(props) {
    super(props)
    this.updateRightView = this.updateRightView.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRightPress: this.headerRightPress,
      rightTitle: '车辆选择'
    })
  }
  updateRightView() {
    this.props.navigation.setParams({
      headerRightPress: this.headerRightPress,
      rightTitle: '车辆选择3'
    })
  }
  headerRightPress = () => {
    const { navigation } = this.props;
    navigation.navigate('SelectCar', { callback: (data) => { this.updateRightView() }});
  }
  render() {
    return <GetCarstockProductListPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { getCarstockProductList } = state;
  return {
    getCarstockProductList
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GetCarstockProductListContainer);
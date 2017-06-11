import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import AddDeliveryOrderPage from '../../pages/work/AddDeliveryOrderPage';

let theCar;
class AddDeliveryOrderContainer extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    const rightTitle = navigation.state.params ? navigation.state.params.rightTitle : '车辆选择';
    console.log(navigation.state.params)
    return {
      title: `${navigation.state.params.customersName}`,
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
    theCar = ""
    this.props.navigation.setParams({
      headerRightPress: this.headerRightPress,
      rightTitle: '车辆选择'
    })
  }
  componentWillReceiveProps(nextProps) {
    const { addDeliveryOrder } = nextProps;
    if (addDeliveryOrder.selectCar) {
      if (theCar != addDeliveryOrder.selectCar.platenumber) {
        theCar = addDeliveryOrder.selectCar.platenumber;
        this.updateRightView(addDeliveryOrder.selectCar)
      }
    }
  }
  intervalAction(data) {
    this.timer && clearTimeout(this.timer)
    this.props.navigation.setParams({
      rightTitle: data.platenumber//'车辆选择3'
    })

  }
  updateRightView(data) {
    console.log(data)
    this.timer = setTimeout(this.intervalAction.bind(this, data), 10)
  }
  headerRightPress = () => {
    const { navigation } = this.props;
    navigation.navigate('SelectCar', { callback: (data) => this.updateRightView(data) })
  }
  render() {
    return <AddDeliveryOrderPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { addDeliveryOrder } = state;
  return {
    addDeliveryOrder
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDeliveryOrderContainer);

import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont, Toast } from 'react-native-go';
import * as actions from '../../actions/Actions';
import NavigationBar from '../../components/NavigationBar'
import AddDeliveryOrderPage from '../../pages/work/AddDeliveryOrderPage';

class AddDeliveryOrderContainer extends React.Component {
  //title: ` ${navigation.state.params.customersName}`,
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: ` ${navigation.state.params.customersName}`,
    }
  };
  /*
  constructor(props) {
    super(props)
    this.updateRightView = this.updateRightView.bind(this);
    this.renderRightView = this.renderRightView.bind(this);
    this.callback = this.callback.bind(this)
    this.carList = []
    this.state = {
      selectCar: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    const { addDeliveryOrder } = nextProps;
    this.carList = addDeliveryOrder.carList
    if (!this.state.selectCar.platenumber && this.carList.length > 0) {
      this.setState({ selectCar: addDeliveryOrder.carList[0] })
    }
  }
  updateRightView(data) {
    this.setState({ selectCar: data })

  }
  callback(data) {
    this.updateRightView(data)
  }
  headerRightPress = () => {
    const { navigation } = this.props;
    if (this.carList.length === 0) {
      Toast.show('暂无车辆')
    } else if (this.carList.length === 1) {
      Toast.show('当前只有该辆车')
    } else {
      navigation.navigate('ShowSelectCar', {
        carList: this.carList, callback: this.callback
      })
    }
  }
  renderRightView() {
    return (
      <View>
        <Iconfont
          icon={'e66e'} // 图标
          iconColor={'#fff'}
          iconSize={22}
          position={'left'}
          label={this.state.selectCar.platenumber ? this.state.selectCar.platenumber : '暂无车辆'}
          labelColor={'#fff'}
        />
      </View>)
  }
    */
  render() {
    const { customersName } = this.props.navigation.state.params;
    return (
      <AddDeliveryOrderPage {...this.props} />
    );
  }
  /* render() {
     const { customersName } = this.props.navigation.state.params;
     return (
       <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
         <NavigationBar title={customersName} navigator={this.props.navigation} rightView={this.renderRightView} onRightButtonPress={this.headerRightPress} />
         <AddDeliveryOrderPage {...this.props} selectCar={this.state.selectCar} />
       </View>
     );
   }*/
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

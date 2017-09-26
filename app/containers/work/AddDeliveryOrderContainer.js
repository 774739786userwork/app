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
  
  render() {
    const { customersName } = this.props.navigation.state.params;
    return (
      <AddDeliveryOrderPage {...this.props} />
    );
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

import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import AddDeliveryOrderEndPage from '../../pages/work/AddDeliveryOrderEndPage';


class AddDeliveryOrderEndPageContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: ` ${navigation.state.params.customersName}`,
      headerRight: (<TouchableOpacity onPress={() => {
        navigation.state.params.headerRemarkRightPress();
      }}>
        <View style={{ marginRight: 8 }}>
          <Iconfont
            label={'写备注'}
            labelSize={16}
            labelColor={'#fff'}
          />
        </View>
      </TouchableOpacity>)
    };
  };
  
  
  render() {
    return <AddDeliveryOrderEndPage {...this.props} />;
  }
}



const mapStateToProps = (state) => {
  const { addLadingbillsProduct, saveLadingbillsProduct } = state;
  return {
    addLadingbillsProduct, saveLadingbillsProduct
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDeliveryOrderEndPageContainer);

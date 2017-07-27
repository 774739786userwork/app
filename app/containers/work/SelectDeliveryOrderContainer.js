import React from 'react';
import {
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';
import NavigationBar from '../../components/NavigationBar';
import SelectDeliveryOrderPage from '../../pages/work/SelectDeliveryOrderPage';

/**
 * 送货单列表查询
 */
let daySalerSum = '';
class SelectDeliveryOrderContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { header: null };
  };

  renderRightView(){
    return(
      <View>
        <Text style={{color:'#fff'}}>¥{`${daySalerSum}`}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <NavigationBar title={'送货单查询'} navigator={this.props.navigation} rightView={this.renderRightView}/>
        <SelectDeliveryOrderPage {...this.props} />
      </View>
    );
    
  }
}

const mapStateToProps = (state) => {
  const { selectDeliveryOrder } = state;
  daySalerSum = selectDeliveryOrder.day_saler_sum;
  return {
    selectDeliveryOrder
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDeliveryOrderContainer);

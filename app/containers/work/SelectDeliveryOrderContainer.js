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
let day_saler_sum = 0
class SelectDeliveryOrderContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: '送货单查询',
      headerRight: (<View>
        <Text style={{ color: '#fff',marginRight:12 }}>¥{`${navigation.state.params ? navigation.state.params.day_saler_sum : 0}`}</Text>
      </View>)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (day_saler_sum != nextProps.selectDeliveryOrder.day_saler_sum) {
      day_saler_sum = nextProps.selectDeliveryOrder.day_saler_sum;
      this.props.navigation.setParams({ day_saler_sum })
    }
  }
  render() {
    return (<SelectDeliveryOrderPage {...this.props} />);
  }
}

const mapStateToProps = (state) => {
  const { selectDeliveryOrder } = state;
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

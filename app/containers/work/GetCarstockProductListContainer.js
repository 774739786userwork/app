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

  static navigationOptions = {
    title: '车存货单',
  };
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

import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import GetCarSurplusGoodsListPage from '../../pages/work/GetCarSurplusGoodsListPage';


class GetCarSurplusGoodsListContainer extends React.Component {

  static navigationOptions = {
    title: '车余货单',
  };
  render() {
    return <GetCarSurplusGoodsListPage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(GetCarSurplusGoodsListContainer);

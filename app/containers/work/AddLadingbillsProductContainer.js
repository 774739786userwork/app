import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import AddLadingbillsProductPage from '../../pages/work/AddLadingbillsProductPage';


class AddLadingbillsProductContainer extends React.Component {
   static navigationOptions = ({ navigation }) => ({
    title: ` ${navigation.state.params.loadingbill_date}`,
  });
  render() {
    return <AddLadingbillsProductPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { addLadingbillsProduct } = state;
  return {
    addLadingbillsProduct
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLadingbillsProductContainer);

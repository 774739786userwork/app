import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import GetDebtPayNoteListPage from '../../pages/work/GetDebtPayNoteListPage';


class GetDebtPayNoteListContainer extends React.Component {

  static navigationOptions = {
    title: '欠款单',
  };
  render() {
    return <GetDebtPayNoteListPage {...this.props} />;
  }
}

// const mapStateToProps = (state) => {
//   const {  } = state;
//   return {
    
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   const action = bindActionCreators(actions, dispatch);
//   return {
//     action
//   };
// }; connect(mapStateToProps, mapDispatchToProps)(GetDebtPayNoteListContainer)

export default GetDebtPayNoteListContainer;

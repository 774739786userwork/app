


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login4MsgPage from '../../pages/Login4MsgPage';
import * as actions from '../../actions/Actions';

class Login4MsgContainer extends React.Component {
    static navigationOptions = {
       title:'短信验证'
    };
    render() {
        return (
            <Login4MsgPage {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
  const { sendMsg } = state;
  return { sendMsg };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login4MsgContainer);


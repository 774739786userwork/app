
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoginPage from '../../pages/LoginPage';
import * as actions from '../../actions/Actions';

class LoginContainer extends React.Component {
    static navigationOptions = {
        header: null
    };
    render() {
        return (
            <LoginPage {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
  const { login } = state;
  return { login };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);

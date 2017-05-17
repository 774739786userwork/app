
import React from 'react';
import LoginPage from '../../pages/LoginPage';

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

export default LoginContainer;

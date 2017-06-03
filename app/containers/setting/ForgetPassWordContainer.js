
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ForgetPassWordPage from '../../pages/setting/ForgetPassWordPage';
import * as actions from '../../actions/Actions';
class ForgetPassWordContainer extends React.Component {
static navigationOptions = {
        title: '登录密码修改',
    };
    render() {
        return (
            <ForgetPassWordPage {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const { forgetPassWord } = state;
    return {
        forgetPassWord,
    }
}
const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassWordContainer);

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectUserPage from '../../pages/select/SelectUserPage';

/**
 * 业务员查询
 */
class SelectUserContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '业务员查询',
    });
    render() {
        return <SelectUserPage {...this.props} />;
    }
}

const mapStateToProps = (state) => {
    const { selectName } = state;
    return {
        selectName
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectUserContainer);

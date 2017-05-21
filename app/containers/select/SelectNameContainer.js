import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectNamePage from '../../pages/select/SelectNamePage';

/**
 * 车辆选择
 */
class SelectNameContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '业务员查询',
    });
    render() {
        return <SelectNamePage {...this.props} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectNameContainer);

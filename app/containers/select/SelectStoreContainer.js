import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectStorePage from '../../pages/select/SelectStorePage';

/**
 * 车辆选择
 */
class SelectStoreContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '仓库查询',
    });
    render() {
        return <SelectStorePage {...this.props} />;
    }
}

const mapStateToProps = (state) => {
    const { selectStore } = state;
    return {
        selectStore
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectStoreContainer);

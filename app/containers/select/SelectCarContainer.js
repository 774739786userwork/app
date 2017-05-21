import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectCarPage from '../../pages/select/SelectCarPage';

/**
 * 车辆选择
 */
class SelectCarContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '选车牌号码',
    });
    render() {
        return <SelectCarPage {...this.props} />;
    }
}

const mapStateToProps = (state) => {
    const { selectCar } = state;
    return {
        selectCar
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCarContainer);

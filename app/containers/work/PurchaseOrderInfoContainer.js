import React from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import PurchaseOrderDetailPage from '../../pages/work/PurchaseOrderDetailPage';
import PurchaseOrderInfoPage from '../../pages/work/PurchaseOrderInfoPage';

/**
 * 订货单查询
 */
class PurchaseOrderInfoContainer extends React.Component {
    static navigationOptions = {
        title: '订货单查询',
    };
    render() {
        return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <PurchaseOrderDetailPage {...this.props} />
        </View>);
    }
}

const mapStateToProps = (state) => {
    const { purchaseOrderDetail, purchaseOrderInfo } = state;
    return {
        purchaseOrderDetail, purchaseOrderInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderInfoContainer);

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
            <ScrollableTabView
                renderTabBar={() => (
                    <DefaultTabBar tabStyle={{ paddingBottom: 0}} textStyle={{ fontSize: 16 }} style={{height: 40}} />
                )}
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"
            >
                <PurchaseOrderDetailPage key={'0'} tabLabel={'订单明细'} {...this.props} />
                <PurchaseOrderInfoPage key={'1'} tabLabel={'订单汇总'} {...this.props} />
            </ScrollableTabView>
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

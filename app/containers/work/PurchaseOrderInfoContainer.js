import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';
import PurchaseOrderDetailPage from '../../pages/work/PurchaseOrderDetailPage';
import PurchaseOrderInfoPage from  '../../pages/work/PurchaseOrderInfoPage';

/**
 * 订货单查询
 */
class PurchaseOrderInfoContainer extends React.Component {
    static navigationOptions = {
        title: '订货单查询',
    };
    render() {
        return (<View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <DefaultTabBar tabStyle={{ paddingBottom: 0 }} textStyle={{ fontSize: 16 }} />
                )}
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"
            >
                <PurchaseOrderDetailPage {...this.props}/>
                <PurchaseOrderInfoPage {...this.props}/>
            </ScrollableTabView>
        </View>);
    }
}

const mapStateToProps = (state) => {
    const { purchaseOrderDetail,purchaseOrderInfo } = state;
    return {
        purchaseOrderDetail,purchaseOrderInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLadingbillsContainer);

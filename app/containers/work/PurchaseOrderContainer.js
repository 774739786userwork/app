import React from 'react';
import {
  View,
} from 'react-native';
import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import AddPurchaseOrder from '../../pages/work/AddPurchaseOrder';
import PurchaseOrderListPage from '../../pages/work/PurchaseOrderListPage'

/**
 * 开订货单
 */
class PurchaseOrderContainer extends React.Component {
    static navigationOptions = {
        title: '开订货单',
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
                <AddPurchaseOrder key={'0'} tabLabel={'新建订货单'} {...this.props} />
                <PurchaseOrderListPage key={'1'} tabLabel={'配送订货单'} {...this.props} />
            </ScrollableTabView>
        </View>);
    }
}


export default PurchaseOrderContainer;

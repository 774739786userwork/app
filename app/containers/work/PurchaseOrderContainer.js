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
            
                <AddPurchaseOrder {...this.props} />
            
        </View>);
    }
}


export default PurchaseOrderContainer;

//<PurchaseOrderListPage key={'1'} tabLabel={'配送订货单'} {...this.props} />

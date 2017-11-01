import React from 'react';
import {
    View,
    Text,
    InteractionManager
} from 'react-native';
import { Iconfont, FetchManger } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import PriceDetailCustomerPage from './PriceDetailCustomerPage';
import PriceDetailYWYPage from './PriceDetailYWYPage'
/**
 * 未收明细 */
class PriceDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: `最高价/最低价情况`
        };
    };
    render() {
        return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollableTabView
                renderTabBar={() => (
                    <DefaultTabBar tabStyle={{ paddingBottom: 0 }} textStyle={{ fontSize: 16 }} style={{ height: 40 }} />
                )}
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"
            >
            <PriceDetailCustomerPage key={'1'} tabLabel={'客户'} {...this.props}/>
                <PriceDetailYWYPage key={'2'} tabLabel={'业务员'} {...this.props} />
                
            </ScrollableTabView>
        </View>);
    }
}
export default PriceDetailPage;

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
 * 价格明细 */
class PriceDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let param = state.params.param;
        if (param.year) {
            param.currTime = param.year+'年';
        }
        if (param.month) {
            param.currTime = param.month+'月';
        }
        let title = param.currTime+param.orgName+param.seriesName;

        return {
            headerTitleStyle: {fontSize: 16},
            title: title+`最高价/最低价`
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

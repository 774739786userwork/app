import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Iconfont } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import S_ProductDetailCustPage from './S_ProductDetailCustPage';
import S_ProductDetailChartPage from './S_ProductDetailChartPage'
/**
 * 产品详情 */
class S_ProductDetailContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `详情`
    });
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
                <S_ProductDetailCustPage key={'0'} tabLabel={'客户'} {...this.props} />
                <S_ProductDetailCustPage key={'1'} tabLabel={'业务员'} {...this.props} />
                <S_ProductDetailChartPage key={'2'} tabLabel={'趋势'} {...this.props} />
            </ScrollableTabView>
        </View>);
    }
}
export default S_ProductDetailContainer;

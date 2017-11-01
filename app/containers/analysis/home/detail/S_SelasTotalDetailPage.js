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

import S_ProductDetailPage from './S_ProductDetailPage';
import S_SeriesDetailPage from './S_SeriesDetailPage';
import S_GroupDetailPage from './S_GroupDetailPage';
/**
 * 销售总额明细 */
class S_SelasTotalDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: `销售总额明细`
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
                <S_SeriesDetailPage key={'0'} tabLabel={'系列'} {...this.props} />
                <S_ProductDetailPage key={'1'} tabLabel={'产品'} {...this.props} />
                <S_GroupDetailPage key={'2'} tabLabel={'销售组'} {...this.props}/>
            </ScrollableTabView>
        </View>);
    }
}
export default S_SelasTotalDetail;

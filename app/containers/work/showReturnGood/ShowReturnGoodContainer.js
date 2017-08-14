import React from 'react';
import {
  View,
} from 'react-native';
import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import ShowReturnGoodPage from './ShowReturnGoodPage';

/**
 * 订货单查询
 */
class ShowReturnGoodContainer extends React.Component {
    static navigationOptions = {
        title: '退货单查询',
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
                <ShowReturnGoodPage key={'0'} tabLabel={'退货管理'} {...this.props} />
                <ShowReturnGoodPage key={'1'} tabLabel={'退空管管理'} {...this.props} />
            </ScrollableTabView>
        </View>);
    }
}


export default ShowReturnGoodContainer;

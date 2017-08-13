import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Iconfont } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import ReturnGoodListPage from './ReturnGoodListPage';
import ReturnEmptyGoodListPage from './ReturnEmptyGoodListPage';

/**
 * 退货单管理 */
class ReturnGoodListContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.contactId[0]}`,
        headerRight: (<View>
            <Text style={{ color: '#fff', marginRight: 12 }}>{`${navigation.state.params.car_id[0]}`}</Text>
        </View>)
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
                <ReturnGoodListPage key={'0'} tabLabel={'退货管理'} {...this.props} />
                <ReturnEmptyGoodListPage key={'1'} tabLabel={'退空管管理'} {...this.props} />
            </ScrollableTabView>
        </View>);
    }
}
export default ReturnGoodListContainer;

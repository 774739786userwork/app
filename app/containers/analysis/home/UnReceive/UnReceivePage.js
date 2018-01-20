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

import UnReceiveCustomerPage from './UnReceiveCustomerPage';
import UnReceiveYWYPage from './UnReceiveYWYPage'
/**
 * 未收明细 */
class UnReceivePage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let param = state.params.param;
        if (param.year) {
            param.currTime = param.year;
        }
        if (param.month) {
            param.currTime = param.month;
        }
        let title = param.currTime+param.orgName;

        return {
            headerTitleStyle: {fontSize: 16},
            title: title+`未收明细`
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
                <UnReceiveYWYPage key={'1'} tabLabel={'业务员'} {...this.props} />
                <UnReceiveCustomerPage key={'2'} tabLabel={'客户'} {...this.props}/>
            </ScrollableTabView>
        </View>);
    }
}
export default UnReceivePage;

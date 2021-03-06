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
import S_CustDetailPage from './S_CustDetailPage'
import S_PersonDetailPage from './S_PersonDetailPage'
/**
 * 查询系列本年度与月度的详情 */
class S_SelasTotalDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        let title;
        let type = state.params.type;
        if('0' === type){
            title = state.params.currTime+'年'+state.params.orgName;
        }else{
            title = state.params.currTime+'月'+state.params.orgName;
        }
        return {
            headerTitleStyle: {fontSize: 16},
            title: title
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
                <S_CustDetailPage key={'0'} tabLabel={'客户'} {...this.props} />
                <S_ProductDetailPage key={'1'} tabLabel={'产品'} {...this.props} />
                <S_PersonDetailPage key={'2'} tabLabel={'业务员'} {...this.props}/>
            </ScrollableTabView>
        </View>);
    }
}
export default S_SelasTotalDetail;

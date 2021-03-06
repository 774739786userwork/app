import React from 'react';
import {
    View,
    Text,
    InteractionManager,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { Iconfont, FetchManger } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import YearyPage from './sumpartcustomer/YearyPage';
import MonthPage from './sumpartcustomer/MonthPage';
/**
 * 客户分段 */
class SumPartCustomerPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `客户分段`,
    });
    renderTabBar(tab) {
        let activeTab = tab.activeTab;
        let color0 = activeTab == 0 ? "#0081d4" : "#fff";
        let tColor0 = activeTab == 0 ? "#fff" : "#0081d4";
        let color1 = activeTab == 1 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor1 = activeTab == 1 ? "#fff" : "#0081d4";
        return (
            <View style={{
                height: 48, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{ flex: 1 }} />
                <View style={styles.tabs}>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(0)} style={styles.tab}>
                        <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
                            <Text style={{ color: tColor0 }}>
                                年
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(1)} style={styles.tab}>
                        <View style={[styles.tabItem2, { backgroundColor: color1 }]} >
                            <Text style={{ color: tColor1 }}>
                                月
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 1 }} />
            </View>
        );

    }
    render() {
        return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollableTabView locked={true} initialPage={0} renderTabBar={this.renderTabBar} >
                <YearyPage key={'0'} activeTab ={0} {...this.props} tabLabel={'year'}/>
                <MonthPage key={'1'}  activeTab ={1} {...this.props} tabLabel={'month'}/>
              </ScrollableTabView>
        </View>);
    }
}
export default SumPartCustomerPage;

const styles = StyleSheet.create({
    iconStyle: {
        width: 26,
        height: 26,
    },
    textStyle: {
        color: '#666',
        marginBottom: 6,
    },
    selectedTextStyle: {
        color: '#42beff',
        marginBottom: 6,
    }, tabs: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
        width: 180,
        flexDirection: 'row',
    },
    tab: {
        height: 30,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem0: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,

    },
    tabItem1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
    },
    tabItem2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 34,
        borderColor: '#0081d4',
        borderWidth: StyleSheet.hairlineWidth,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },

});
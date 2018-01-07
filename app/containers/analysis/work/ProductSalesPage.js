import React from 'react';
import {
    View,
    Text,
    InteractionManager,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { Iconfont, FetchManger } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import AllSeriesModel from './productseries/AllSeriesModel'
import DayPage from './productseries/DayPage'
import MonthPage from './productseries/MonthPage';
import WeekPage from './productseries/WeekPage'
import QuarterPage from './productseries/QuarterPage'
/**
 * 产品销量 */
class ProductSalesPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `产品销量`,
        headerRight: (<TouchableOpacity onPress={() => {
            navigation.state.params.headerRightPress();
        }}>
            <View style={{ marginRight: 8 }}>
                <Text style={{ color: '#fff' }}>{'筛选'}</Text>
            </View>
        </TouchableOpacity>)
    });
    constructor(props) {
        super(props)
        this.headerRightPress = this.headerRightPress.bind(this);
        this.state = {
            modelShow: false,
            selectedIds:[100012]
        }
    }
    componentDidMount() {
        this.props.navigation.setParams({
            headerRightPress: this.headerRightPress,
        })
    }
    headerRightPress() {
        this.setState({ modelShow : true})
    }
    renderTabBar(tab) {
        let activeTab = tab.activeTab;
        let color0 = activeTab === 0 ? "#0081d4" : "#fff";
        let tColor0 = activeTab === 0 ? "#fff" : "#0081d4";
        let color1 = activeTab === 1 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor1 = activeTab === 1 ? "#fff" : "#0081d4";
        let color2 = activeTab === 2 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor2 = activeTab === 2 ? "#fff" : "#0081d4";
        let color3 = activeTab === 3 ? "#0081d4" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        let tColor3 = activeTab === 3 ? "#fff" : "#0081d4";
        return (
            <View style={{
                height: 48, backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', elevation: 5,
            }}>
                <View style={{ flex: 1 }} />
                <View style={styles.tabs}>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(0)} style={styles.tab}>
                        <View style={[styles.tabItem0, { backgroundColor: color0 }]} >
                            <Text style={{ color: tColor0 }}>
                                日
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(1)} style={styles.tab}>
                        <View style={[styles.tabItem1, { backgroundColor: color1 }]} >
                            <Text style={{ color: tColor1 }}>
                                周
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(2)} style={styles.tab}>
                        <View style={[styles.tabItem1, { backgroundColor: color2 }]} >
                            <Text style={{ color: tColor2 }}>
                                月
							</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => tab.goToPage(3)} style={styles.tab}>
                        <View style={[styles.tabItem2, { backgroundColor: color3 }]} >
                            <Text style={{ color: tColor3 }}>
                                季
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
                <DayPage key={'0'} activeTab={0} {...this.props} selectedIds={this.state.selectedIds} tabLabel={'year'} />
                <WeekPage key={'1'} activeTab={1} {...this.props} selectedIds={this.state.selectedIds} tabLabel={'month'} />
                <MonthPage key={'2'} activeTab={0} {...this.props} selectedIds={this.state.selectedIds} tabLabel={'year'} />
                <QuarterPage key={'3'} activeTab={1} {...this.props}  selectedIds={this.state.selectedIds} tabLabel={'month'} />
            </ScrollableTabView>
            <AllSeriesModel modalVisible={this.state.modelShow} selectedIds={this.state.selectedIds}
                onCancelPress={() => { this.setState({ modelShow: false }) }}
                onConfirmPress={(data) => { 
                    console.log(data);
                    this.setState({ modelShow: false,selectedIds:data }) 
                 }} />
        </View>);
    }
}
export default ProductSalesPage;

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
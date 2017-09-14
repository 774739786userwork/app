import React from 'react';
import {
    View,
    Text,
    InteractionManager
} from 'react-native';
import { Iconfont,FetchManger } from 'react-native-go';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import S_ProductDetailCustPage from './S_ProductDetailCustPage';
import S_ProductDetailChartPage from './S_ProductDetailChartPage'
import S_ProductDetailEmployeePage from './S_ProductDetailEmployeePage'
/**
 * 产品详情 */
class S_ProductDetailContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `详情`
    });
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            customerList:[],
            employeeList:[],
            productSumList:[],
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({loading:true});
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri("dataCenter/appHomePage/getSingleProductSaler.page", params,30*60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let customerList = responseData.customerList;
                    let employeeList = responseData.employeeList;
                    let productSumList = responseData.productSumList;
                    this.setState({ customerList,employeeList,productSumList,loading:false })
                }else{
                    this.setState({loading:false});
                }
            }).catch((error) => {
                this.setState({loading:false});
            })
        });
    }
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
                <S_ProductDetailCustPage key={'0'} tabLabel={'客户'} {...this.props} dataList={this.state.customerList}/>
                <S_ProductDetailEmployeePage key={'1'} tabLabel={'业务员'} {...this.props} dataList={this.state.employeeList}/>
                <S_ProductDetailChartPage key={'2'} tabLabel={'趋势'} {...this.props} dataList={this.state.productSumList}/>
            </ScrollableTabView>
        </View>);
    }
}
export default S_ProductDetailContainer;

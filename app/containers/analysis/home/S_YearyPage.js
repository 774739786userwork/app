import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    ScrollView,
    WebView,
    Dimensions,
    InteractionManager
} from 'react-native';
import YearPicker from '../../../components/YearPicker'
import * as DateUtils from '../../../utils/DateUtils'
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast, Iconfont } from 'react-native-go'
import TableRow from './TableRow'
import Spinner from 'react-native-loading-spinner-overlay';
import * as NumberUtils from '../../../utils/NumberUtils'
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
export default class S_YearyPage extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.onMoreAction = this.onMoreAction.bind(this);
        this.onNuShowAction = this.onNuShowAction.bind(this);
        this.onTotalAction = this.onTotalAction.bind(this);
        let { year } = DateUtils.yearMonth();
        this.state = {
            selY: year,
            yearTotalSum: 0.00,
            yearUnReceiveSum: 0.00,
            yearReturnTotalSum:0.00,
            showSpinner: false,
            yearFactory: [],
            charList: []
        }
    }
    componentDidMount() {
        this.loadData(this.state.selY)
    }
    loadData(year) {
        const userId = LoginInfo.getUserInfo().user_id;
        let param = { year: year, userId: userId };
        this.setState({showSpinner:true})
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearAll.page', param).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    let yearTotalSum = data.yearTotalSum ? data.yearTotalSum : 0;
                    let yearUnReceiveSum = data.yearUnReceiveSum ? data.yearUnReceiveSum : 0;
                    let yearReturnTotalSum = data.returnTotalSum ? data.returnTotalSum : 0;
                    this.setState({ yearTotalSum, yearUnReceiveSum, yearReturnTotalSum })
                }
            }).catch((error) => {

            })
        });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearFactory.page', param).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ yearFactory: data,showSpinner:false })
                }else{
                    this.setState({showSpinner:false})
                }
            }).catch((error) => {
                this.setState({showSpinner:false})
            })
        });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getYearFactoryChart.page', param).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let data = responseData.data;
                    this.setState({ charList: data })
                }
            }).catch((error) => {

            })
        });
    }
    //点击更多查看
    onMoreAction() {
        const { navigation } = this.props;
        const userId = LoginInfo.getUserInfo().user_id
        let param = { year: this.state.selY, type: 0 ,userId: userId };
        let reqUrl = "dataCenter/appHomePage/getYearMoreFactory.page";
        navigation.navigate('S_HomeDetail', { reqUrl: reqUrl, param:param })
    }

    onTotalAction(item) {
        const { navigation } = this.props;
        const userId = LoginInfo.getUserInfo().user_id;
        let param = { type: 0, orgId: item.orgId,orgName:item.orgName, currTime: this.state.selY,userId:userId};
        navigation.navigate('S_SelasTotalDetailPage', { param })
    }
    onNuShowAction(item) {
        const { navigation } = this.props;
        let param = { type: 0, orgId: item.orgId,orgName:item.orgName,currTime:this.state.selY };
        navigation.navigate('UnReceivePage', { param })
    }

    render() {
        let yearData = [];
        let yearFactory = this.state.yearFactory
        for (var i = 0; i < yearFactory.length; i++) {
            let item = yearFactory[i];
            yearData.push(item)
        }

        let charList = [];
        let old_charList = this.state.charList
        for (var i = 0; i < old_charList.length; i++) {
            if (i < 3) {
                let item = old_charList[i];
                charList.push(item)
            }
        }
        let legend = [];
        let seriesData = [];
        let xData = []
        charList.map((item) => {
            let chartItem = {};
            chartItem.type = 'line';
            chartItem.name = item.orgName;
            chartItem.data = [];
            let init = xData.length === 0
            item.monthList.map((monthListItem) => {
                let monthtotalSum = monthListItem.monthtotalSum;
                chartItem.data.push(parseFloat(monthtotalSum));
                if (init) {
                    xData.push(monthListItem.monthname);
                }
            })
            legend.push(item.orgName);
            seriesData.push(chartItem)
        })
        const option = {
            tooltip: {    //点击弹框
                trigger: 'axis'
            },
            legend: {
                data: legend
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto'
                },
                axisTick: {
                    show: 'false',
                    alignWithLabel: true
                },
                //x轴数据
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            color: ['#ee5f8f', '#e8ba00', '#33cc99'],//自定义线条颜色，你可以设置多个颜色，使用时默认从第一个开始   如果不设置color则有它默认颜色
            // series里面的数据  如果是固定的线条 你只需要改变data数据就ok  
            // 如果不是确定有多少折线  建议吧整个serise数据替换掉   例如：series:[{...}{...}{...},...]配置项和下面一样
            series: seriesData
        };

        let yearSum = '';
        if(this.state.yearTotalSum > 10000){
            yearSum = NumberUtils.fc(this.state.yearTotalSum/10000) + '亿'
        }else{
            yearSum = this.state.yearTotalSum + '万'
        }

        let userId = LoginInfo.getUserInfo().user_id;
        let year = this.state.selY;
        let html = global.baseUrl + 'db/dataCenterJsp/getYearChart.jsp?year='+year+'&userId='+userId;
        return (
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={{
                        paddingTop: 8,
                        alignContent: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        flexDirection: 'row'
                    }}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => {

                        }}>
                            <Iconfont
                                icon={'e688'} // 图标
                                iconColor={'#aaa'}
                                iconSize={26} />
                        </TouchableOpacity>
                        <YearPicker
                            style={{ width: 120 }}
                            customStyles={{
                                dateText: {
                                    fontSize: 18,
                                    color: '#000',
                                }
                            }}
                            selY={this.state.selY}
                            onDateChange={(selY, ymStr) => {
                                this.loadData(selY);
                                this.setState({ selY })
                            }}
                        />
                        <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {

                        }}>
                            <Iconfont
                                icon={'e657'} // 图标
                                iconColor={'#aaa'}
                                iconSize={26} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{
                        alignContent: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#f9f9f9',
                        paddingTop: 12,
                        paddingBottom: 12
                    }}>
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'总额'}</Text>
                            <Text style={{ lineHeight: 24, marginLeft: 2, color: '#17c6c1', fontSize: 20 }}>{yearSum}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'退货'}</Text>
                            <Text style={{ lineHeight: 24, marginLeft: 2, color: '#17c6c1', fontSize: 20 }}>{`${this.state.yearReturnTotalSum}万`}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={{ lineHeight: 24, color: '#666', fontSize: 12 }}>{'未收'}</Text>
                            <Text style={{ lineHeight: 24, marginLeft: 2, color: '#f80000', fontSize: 20 }}>{`${this.state.yearUnReceiveSum}万`}</Text>
                        </View>
                    </View>
                    <View style={{
                        paddingTop: 12,
                        paddingLeft: 12,
                        paddingRight: 12,
                    }}>
                        <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#dedede' }}>
                            {
                                yearData.map((item) =>
                                    <View key={`row_${item.orgName}`}>
                                    <View style={{
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        padding: 10
                                    }} key={`row_${item}`}>
                                        <Text style={{ color: '#333', width:80 }}>{item.orgName}</Text>
                                        <Text style={{ color: '#666' }}>{'总'}</Text>
                                        <TouchableOpacity onPress={this.onTotalAction.bind(this, item)}>
                                            <Text style={{ width: 68, color: '#17c6c1' }}>{`${item.factoryTotalSum}`}</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: '#666' }}>{'退'}</Text>
                                        <Text style={{ width: 68, color: '#17c6c1' }}>{`${item.returnTotalSum}万`}</Text>
                                        <Text style={{ color: '#666' }}>{'未'}</Text>
                                        <TouchableOpacity onPress={this.onNuShowAction.bind(this, item)}>
                                            <Text style={{ width: 68, color: '#f80000' }}>{`${item.factoryUnReceiveSum}万`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#dedede' }}></View>
                                </View>)
                            }
                        </View>
                    </View>
                    <View style={{
                        marginLeft: 12,
                        marginRight: 12,
                        alignContent: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        flexDirection: 'row'
                    }}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={this.onMoreAction}>
                            <Text style={{ padding: 12, color: '#999' }}>{'查看更多分厂'}</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ flex: 1}}>
                        <WebView style={{width:deviceWidth,height:300}}
                            source={{ uri: html }}  
                            domStorageEnabled={true}
                            javaScriptEnabled={true}
                            startInLoadingState={true}/>
                    </View>
                </View >
                <View><Spinner visible={this.state.showSpinner} textContent={'正在加载,请稍后...'} /></View>
            </ScrollView>
        );
    }
}

/* <Echarts option={option} /> */
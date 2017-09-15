import React from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    InteractionManager
} from 'react-native';
import Echarts from 'native-echarts';
import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'

/**
 * 产品详情 客户 */
class S_SeriesDetailChartPage extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: ` ${navigation.state.params.factoryName}`,
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataList:[]
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true });
        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('dataCenter/appHomePage/getProductSeries.page', params, 30 * 60).then((responseData) => {
                if (responseData.status === '0' || responseData.status === 0) {
                    let dataList = responseData.data;
                    this.setState({ dataList, loading: false })
                } else {
                    this.setState({ loading: false });
                }

            }).catch((error) => {
                this.setState({ loading: false });
            })
        });
    }
    render() {
        let dataList = this.state.dataList;
        let monthList = [];
        let xData = [];
        let yData = [];
        dataList.map((item) => {
            xData.push(item.monthname);
            yData.push(item.monthProductSum);
        });
        let seriesData = [];
        let legend = [];
        dataList.map((item)=>{
            let chartItem = {};
            chartItem.type = 'line';
            chartItem.name = item.seriesName;
            chartItem.data = [];
            let init = xData.length === 0
            item.monthList.map((monthListItem) => {
                let monthProductSum = monthListItem.monthProductSum;
                chartItem.data.push(parseFloat(monthProductSum));
                if (init) {
                    xData.push(monthListItem.monthname);
                }
            })
            legend.push(item.seriesName);
            seriesData.push(chartItem)
        });

        const option = {
            legend: {
                data:legend
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
            yAxis: {},
            color: ['#ee5f8f', '#e8ba00', '#33cc99'],//自定义线条颜色，你可以设置多个颜色，使用时默认从第一个开始   如果不设置color则有它默认颜色
            // series里面的数据  如果是固定的线条 你只需要改变data数据就ok  
            // 如果不是确定有多少折线  建议吧整个serise数据替换掉   例如：series:[{...}{...}{...},...]配置项和下面一样
            series: seriesData

        };
        return <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {
                this.state.loading ? <LoadingView /> : <Echarts option={option} height={300} />
            }
        </View>;
    }
}
export default S_SeriesDetailChartPage;

import React from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet
} from 'react-native';
import Echarts from 'native-echarts';
/**
 * 产品详情 客户 */
class S_ProductDetailChartPage extends React.Component {

    constructor(props) {
        super(props)
       
    }
    render() {
        const { dataList } = this.props;
        let xData = [];
        let seriesData = [];
        dataList.map((item) => {
            xData.push(item.monthname);
            seriesData.push(parseFloat(item.monthProductSum))
        });
        const option = {
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
            series: [{
                type: 'line',
                data: seriesData
            }]

        };
        return <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Echarts option={option} height={300} />
        </View>;
    }
}
export default S_ProductDetailChartPage;

import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    ImageView,
    Text
} from 'react-native';
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//统计分析 厂 详情
class S_HomeDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `厂家数据`
    });
    constructor(props) {
        super(props)
        this._renderSeperator = this._renderSeperator.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(rowData, rowID) {
        return <View style={{ backgroundColor: '#fff' }} key={`index_${rowID}`}>
            <View style={{ backgroundColor: '#f9f9f9', height: 20 }} />
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }}/>
            <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
                <View style={{ height: 34, paddingLeft: 10, marginBottom: 6, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: 16 }}>{'南厂'}</Text>
                </View>
                <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'销售总额'}</Text>
                        <Text style={{ color: '#666' }}>{`1234万`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'未收'}</Text>
                        <Text style={{ color: '#666' }}>{`34万`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'本周增长'}</Text>
                        <Text style={{ color: '#666' }}>{`1234万`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'预计销量'}</Text>
                        <Text style={{ color: '#666' }}>{`34万`}</Text>
                    </View>
                </View>
                <View style={{ height: 30, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'同比增长'}</Text>
                        <Text style={{ color: '#666' }}>{`1234万`}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ color: '#666', width: 70 }}>{'同比增加'}</Text>
                        <Text style={{ color: '#666' }}>{`34万`}</Text>
                    </View>
                </View>
            </View>
        </View>;
    }
    _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }}
            />
        );
    }
    render() {
        let data = ['广东体彩', '广东体彩', '广东体彩', '广东体彩', '广东体彩'];
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <ListView
                dataSource={ds.cloneWithRows(data)}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeperator}
                showsVerticalScrollIndicator={false}
            />
        </View>;
    }
}
export default S_HomeDetailPage;
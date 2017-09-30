import React from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet
} from 'react-native';

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

/**
 * 产品详情 客户 */
class S_ProductDetailEmployeePage extends React.Component {

    constructor(props) {
        super(props)
        this._renderSeperator = this._renderSeperator.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(rowData, rowID) {
        return <View key={`index_${rowID}`}>
            <View style={{ borderColor: '#f2f2f2', borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, backgroundColor: '#fff', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                <Text style={{ color: '#333' }}>{`${rowData.employeeName}`}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text style={{ color: '#333', flex: 1 }}>{`销量 ${rowData.employeeSalerQuantity}`}</Text>
                    <Text style={{ color: '#333', flex: 1 }}>{`金额 ${rowData.employeeSalerSum}`}</Text>
                    <Text style={{ color: '#333', flex: 1 }}>{`占比 ${rowData.employeeIncrease}`}</Text>
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
        let data = this.props.dataList;
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <ListView
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(data)}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeperator}
                showsVerticalScrollIndicator={false}
            />
        </View>;
    }
}
export default S_ProductDetailEmployeePage;

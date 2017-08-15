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
class S_ProductDetailCustPage extends React.Component {

    constructor(props) {
        super(props)
        this._renderSeperator = this._renderSeperator.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(rowData, rowID) {
        return <View style={{ padding: 12, backgroundColor: '#fff' }} key={`index_${rowID}`}>
            <Text style={{ color: '#333' }}>{'南厂'}</Text>
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
export default S_ProductDetailCustPage;
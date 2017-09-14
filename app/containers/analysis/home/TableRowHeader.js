import React from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class TableRowHeader extends React.Component {
  render() {
    let bg = this.props.bg;
    let tColor = this.props.tColor;
    let t0 = this.props.t0;
    let t1 = this.props.t1;
    return <View>
      <View style={{ flexDirection: 'row', backgroundColor: bg }}>
        <Text style={{ padding: 12, flex: 1, color: tColor }}>{t0}</Text>
        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        <Text style={{ padding: 12, flex: 1, color: tColor}}>{t1}</Text>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
    </View>
  }
}

export default TableRowHeader;
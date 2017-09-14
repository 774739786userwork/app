import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

class TableRow extends React.Component {
  render() {
    let onPress = this.props.onPress
    let bg = this.props.bg;
    let tColor = this.props.tColor;
    let t0 = this.props.t0;
    let t1 = this.props.t1;
    return <TouchableOpacity onPress={()=>{
         onPress && onPress()
      }}>
      <View style={{ flexDirection: 'row', backgroundColor: bg }}>
        <Text style={{ padding: 12, flex: 1, color: tColor }}>{t0}</Text>
        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        <Text style={{ padding: 5, flex: 1, color: tColor }}>{t1}</Text>
      </View>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
    </TouchableOpacity>
  }
}

export default TableRow;
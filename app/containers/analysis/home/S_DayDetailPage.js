import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    InteractionManager,
    FlatList,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';

//统计分析 厂 详情
class S_DayDetailPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `详情`
    });
    render() {
        return <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ backgroundColor: '#fff', margin: 12 }}>
                <TableRow t0={'业务员'} t1={'未带新品'} bg={'#17c6c1'} tColor={'#fff'}/>
                <TableRow t0={'业务员'} t1={'未带新品'} bg={'#fff'} tColor={'#666'}/>
            </View>
        </ScrollView>;
    }
}

class TableRow extends React.Component {
    render() {
        let bg = this.props.bg;
        let tColor = this.props.tColor;
        let t0 = this.props.t0;
        let t1 = this.props.t1;
        return <View>
            <View style={{ flexDirection: 'row', backgroundColor: bg }}>
                <Text style={{ padding: 10, width:80, color: tColor }}>{t0}</Text>
                <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                <Text style={{ padding: 10, flex: 1, color: tColor }}>{t1}</Text>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
        </View>
    }
}



export default S_DayDetailPage;
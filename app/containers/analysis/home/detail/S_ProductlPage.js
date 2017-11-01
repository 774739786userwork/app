import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager
} from 'react-native';

import S_ProductDetailPage from './S_ProductDetailPage';

//产品 详情
class S_ProductlPage extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: `销售总额产品明细`
        };
    };
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <S_ProductDetailPage {...this.props}/>
        </View>;
    }
}
export default S_ProductlPage;
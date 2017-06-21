import React, { Component, } from 'react';

import {
    Text,
    View,
    ScrollView
} from 'react-native';

export default class ScanManagerPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        return {
            title: '提示',
        };
    };

    constructor(props) {
        super(props)
        
    }

    render() {
        let content = this.props.navigation.state.params;
       content =  JSON.stringify(content)
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <ScrollView>
                    <View style={{ height: 48, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems:'center' }}>
                        <Text style={{ color: '#999' }}>{'已扫描到以下内容'}</Text>
                    </View>
                    <Text style={{ color: '#333', padding:12,backgroundColor:'#fff' }}>{`${content}`}</Text>
                </ScrollView>
            </View >);
    }
}

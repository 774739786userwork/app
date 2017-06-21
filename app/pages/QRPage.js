import React, { Component } from "react";
import { Text, View } from "react-native";
import QRScannerView from '../components/QRScannerView';
import { NavigationActions } from 'react-navigation'

export default class QRPage extends Component {
    static navigationOptions = {
        title: '二维码扫描',
    };
    constructor(props) {
        super(props)
        this.lastTime = 0;
    }
    render() {
        return (
            < QRScannerView
                hintTextPosition={120}
                hintTextStyle={{ color: '#C0C0C0', }}
                maskColor={'#0000004D'}
                borderWidth={0}
                iscorneroffset={true}
                cornerOffsetSize={0}
                scanBarAnimateTime={3000}
                onScanResultReceived={this.barcodeReceived.bind(this)}
            />
        )
    }

    barcodeReceived(e) {
        if (Date.now() - this.lastTime > 1500) {
            this.lastTime = Date.now();
            console.log(e)
            const { navigation } = this.props;
            const navigationAction = NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    NavigationActions.navigate({ routeName: 'ScanManager',params:{ content: e.data } }),
                ]
            })
            navigation.dispatch(navigationAction)
        }

    }
}
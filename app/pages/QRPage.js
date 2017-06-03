import React, { Component } from "react";
import { Text, View } from "react-native";
import  QRScannerView  from '../components/QRScannerView';

export default class QRPage extends Component {
    static navigationOptions = {
        title: '二维码扫描',
    };
    render() {
        return (
            < QRScannerView
                bottomMenuStyle={{ height: 0, backgroundColor: '#393A3F', opacity: 1 }}
                hintTextPosition={120}
                hintTextStyle={{ color: '#C0C0C0', }}
                maskColor={'#0000004D'}
                borderWidth={0}
                iscorneroffset={false}
                cornerOffsetSize={0}
                scanBarAnimateTime={3000}
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() =>  ( <View />)}
                renderBottomMenuView={() =>  ( <View />)}
            />
        )
    }

    barcodeReceived(e) {
        console.log(e)
    }
}
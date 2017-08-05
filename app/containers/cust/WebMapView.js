import React from 'react'
import {
    WebView,
} from 'react-native'

class WebMapView extends React.Component {
    constructor(props){
        super(props)
        this.injectJS = this.injectJS.bind(this)
    }

    injectJS() {
        let coordinate = this.props.coordinate
        const script = "javascript:addMarker(" + coordinate.longitude + "," + coordinate.latitude + ")";  // eslint-disable-line quotes
        if (this.webview) {
            this.webview.injectJavaScript(script);
        }
    }

    render() {
        //coordinate
        //latitude: result.coordinate.latitude,
        //longitude: result.coordinate.longitude,
        return <WebView
            ref={webview => { this.webview = webview; }}
            style={{ flex: 1 }}
            source={require('./map.html')}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            startInLoadingState={true}
            onLoadEnd={this.injectJS}
        />
    }
}

export default WebMapView;
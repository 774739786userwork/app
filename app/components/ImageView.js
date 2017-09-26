import React from 'react';
import {
    Image,
} from 'react-native';
const ic_product = require('../imgs/ic_product.png')
const ic_empty = require('../imgs/ic_empty.png');

import FastImage from 'react-native-fast-image'


class ImageView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            uri: this.props.source.uri,
            error: this.props.source.uri ? false : true,
        }
    }
    render() {
        let uri = global.baseUrl + this.state.uri
        console.log('ImageView   ' + uri)
        if (this.props.source.uri === 'ic_empty') {
            return <Image style={this.props.style} source={ic_empty} />;
        } else if (this.state.error) {
            return <Image style={this.props.style} source={ic_product} />;
        } else {
            return <FastImage
                style={this.props.style}
                onError={() => this.setState({ error: true })}
                source={{ uri: uri }}
                resizeMode={FastImage.resizeMode.contain} />;
        }
    }
}
export default ImageView;
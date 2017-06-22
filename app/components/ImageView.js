import React from 'react';
import {
    Image,
} from 'react-native';
const ic_product = require('../imgs/ic_product.png')
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
        console.log('ImageView   '+uri)
        return this.state.error ?
            <Image style={this.props.style} source={ic_product} />
            :
            <FastImage
                style={this.props.style}
                onError={() => this.setState({ error: true })}
                source={{ uri: uri }}
                resizeMode={FastImage.resizeMode.contain} />
    }
}
export default ImageView;
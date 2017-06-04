import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native';


class CountDownText extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: this.props.time ? this.props.time : 59,
            disabled: false
        };
        this._countdown = this._countdown.bind(this);
    }
    render() {
        let textStyle = this.state.disabled ?  styles.enableText : styles.text;
        var btnStyle = this.state.disabled ? styles.wrapper : styles.enableStyle;
        return (
            <TouchableOpacity
                disabled={this.state.disabled}
                style={[btnStyle, this.props.buttonStyle]}
                onPress={this._onPress.bind(this)}
            >
                <Text style={[textStyle, this.props.textStyle]}>{this.state.disabled ? '获取验证码(' + this.state.time + ')' : '获取验证码'} </Text>
            </TouchableOpacity>
        );
    }
    _onPress() {
        if (this.state.disabled) {
            //nothing
        } else {
            if (this.props.onPress) {
                if (this.props.onPress()) {
                    this.setState({ disabled: true });
                    this._countdown();
                }
            }
        }
    }

    _countdown() {
        var timer = () => {
            var time = this.state.time - 1;

            this.setState({ time: time });
            if (time > 0) {
                this.theTimer = setTimeout(timer, 1000);
            } else {
                this.setState({ disabled: false });
                this.setState({ time: this.props.time ? this.props.time : 60 });
            }
        };
        this.theTimer = setTimeout(timer.bind(this), 1000);
    }
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.theTimer && clearTimeout(this.theTimer);
    }
}

var styles = StyleSheet.create({
    text: {
        color: '#666'
       
    },
    enableText: {
         color: '#cbcbcb'
    },
    wrapper: {
        padding: 10,
        backgroundColor: '#fefefe',
        borderColor: '#ddd',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    enableStyle: {
        padding: 10,
        backgroundColor: '#fefefe',
        borderColor: '#ddd',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    }

});

export default CountDownText;
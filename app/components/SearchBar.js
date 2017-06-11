import React, { PropTypes } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { Iconfont } from 'react-native-go';
import dismissKeyboard from 'dismissKeyboard';

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#b6b6b6',
        borderStyle: 'solid',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
    },
    searchBarInput: {
        flex: 1,
        color: '#bbb',
        backgroundColor: 'transparent',
    },
});
export default class SearchBar extends React.Component {

    static propTypes = {
        height: PropTypes.number.isRequired,
        autoCorrect: PropTypes.bool,
        returnKeyType: PropTypes.string,
        onSearchChange: PropTypes.func,
        placeholder: PropTypes.string,
        padding: PropTypes.number,
        inputStyle: PropTypes.object,
        iconCloseName: PropTypes.string,
        iconSearchName: PropTypes.string,
        iconBackName: PropTypes.string,
        placeholderColor: PropTypes.string,
        iconColor: PropTypes.string
    }

    static defaultProps = {
        onSearchChange: () => { },
        inputStyle: {},
        iconCloseName: "e688",
        iconSearchName: "e689",
        iconBackName: "e651",
        placeholder: "请输入搜索内容",
        returnKeyType: "search",
        padding: 5,
        placeholderColor: "#bdbdbd",
        iconColor: "#737373"
    }

    constructor(props) {
        super(props);
        this.state = {
            isOnFocus: false,
        };
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onClose = this._onClose.bind(this);
        this._clearText = this._clearText.bind(this);
        this.onTextChangeFire = this.onTextChangeFire.bind(this);
    }

    _onClose() {
        this._clearText();
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    _onFocus() {
        this.setState({ isOnFocus: true });
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    _onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    _clearText() {
        this._textInput.setNativeProps({ text: '' });
        this.props.onSearchChange({ nativeEvent: { text: '' } });
    }

    _dismissKeyboard() {
        dismissKeyboard()
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    onTextChangeFire(text) {
        const {
            onSearchChange,
        } = this.props;

        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            onSearchChange && onSearchChange(text);
        }, 500);
    }

    render() {
        const {
            height,
            autoCorrect,
            returnKeyType,
            onSearchChange,
            placeholder,
            padding,
            inputStyle,
            iconColor,
            iconBackName,
            iconSearchName,
            iconCloseName,
            placeholderColor
        } = this.props;

        let { iconSize } = this.props

        iconSize = typeof iconSize !== 'undefined' ? iconSize : height * 0.5

        return (
            <View
                style={{ padding: padding }}
            >
                <View
                    style={
                        [
                            styles.searchBar,
                            {
                                height: height + 10,
                                paddingLeft: height * 0.25,
                            },
                            inputStyle
                        ]
                    }
                >
                    {this.state.isOnFocus ?
                        <TouchableOpacity onPress={this._dismissKeyboard}>
                            <Iconfont
                                fontFamily={'OAIndexIcon'}
                                icon={iconCloseName} // 图标
                                iconColor='#a3a3a3'
                                iconSize={height * 0.5}
                            />
                        </TouchableOpacity>
                        :
                        <View style={{
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            flex: 0.5,
                        }}>
                            <Iconfont
                                fontFamily={'OAIndexIcon'}
                                icon={iconSearchName} // 图标
                                iconColor='#a3a3a3'
                                iconSize={height * 0.48}
                            />
                        </View>
                    }
                    <TextInput
                        autoCorrect={autoCorrect === true}
                        ref={(c) => (this._textInput = c)}
                        returnKeyType={returnKeyType}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                        onChangeText={this.onTextChangeFire}
                        placeholder={placeholder}
                        onEndEditing={() => {
                            console.log('onEndEditing');
                        }
                        }
                        onSubmitEditing={() => {
                            console.log('onSubmitEditing');
                        }

                        }
                        placeholderTextColor={placeholderColor}
                        underlineColorAndroid="transparent"
                        style={
                            [styles.searchBarInput,
                            {
                                fontSize: height * 0.4,
                            },
                            ]
                        }
                    />
                    {this.state.isOnFocus ?
                        <TouchableOpacity onPress={this._onClose}>
                            <View style={{
                                width: height,
                                height: height,
                            }}>
                                <Iconfont
                                    fontFamily={'OAIndexIcon'}
                                    icon={iconBackName} // 图标
                                    iconColor='#a3a3a3'
                                    iconSize={height * 0.6}
                                />
                            </View>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
        );
    }
}
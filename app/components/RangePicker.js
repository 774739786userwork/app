import React, { Component } from 'react';
import ReactNative, {
    View,
    Text,
    Image,
    Modal,
    PickerIOS,
    TouchableHighlight,
    Platform,
    Animated
} from 'react-native';
import Style from './MonthPickerStyle';
import PickerAndroid from './PickerAndroid';
let Picker = (Platform.OS === 'android') ? PickerAndroid : ReactNative.Picker

const SUPPORTED_ORIENTATIONS = ["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"];

class RangePicker extends Component {
    constructor(props) {
        super(props);
        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderPicker = this.renderPicker.bind(this)
        this.getDateStr = this.getDateStr.bind(this)

        this.state = {
            modalVisible: false,
            animatedHeight: new Animated.Value(0),
            listData:this.props.listData,
            selectedValue: this.props.selectedValue
        };
      
    }

    setModalVisible(visible) {
        // slide animation
        if (visible) {
            this.setState({ modalVisible: visible });
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: Platform.OS === 'android' ? 282 :259,
                    duration: 300
                }
            ).start();
        } else {
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: 0,
                    duration: 300
                }
            ).start(() => {
                this.setState({ modalVisible: visible });
            });
        }
    }

    onPressCancel() {
        this.setModalVisible(false);
        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);
        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(this.state.selectedValue);
        }
    }

    onPressDate() {
        this.setModalVisible(true);
    }

    renderPicker() {
        return (<View style={{
            flex: 1,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{ flex: 1 }}>
                <Picker
                    selectedValue={this.state.selectedValue}
                    onValueChange={(selectedValue) => {
                        this.setState({selectedValue});
                    }}>
                    {
                        this.state.listData.map((item) => {
                            return <Picker.Item label={'' + item} value={item} key={item} />
                        })
                    }
                </Picker>
            </View>
        </View>);
    }
    getDateStr() {
        return this.props.selectedValue;
    }

    render() {
        const {
            style,
            customStyles,
    } = this.props;

        const dateInputStyle = [
            Style.dateInput, customStyles.dateInput
        ];

        return (
            <TouchableHighlight
                style={[Style.dateTouch, style]}
                underlayColor={'transparent'}
                onPress={this.onPressDate}
            >
                <View style={[Style.dateTouchBody, customStyles.dateTouchBody]}>
                    <View style={dateInputStyle}>
                        <Text style={[Style.dateText, customStyles.dateText]}>{this.getDateStr()}</Text>
                    </View>
                    <Modal
                        transparent={true}
                        animationType="none"
                        visible={this.state.modalVisible}
                        supportedOrientations={SUPPORTED_ORIENTATIONS}
                        onRequestClose={() => { this.setModalVisible(false); }}
                    >
                        <View
                            style={{ flex: 1 }}
                        >
                            <TouchableHighlight
                                style={Style.datePickerMask}
                                activeOpacity={1}
                                underlayColor={'#00000077'}
                                onPress={this.onPressCancel}
                            >
                                <TouchableHighlight
                                    underlayColor={'#fff'}
                                    style={{ flex: 1 }}
                                >
                                    <Animated.View
                                        style={[Style.datePickerCon, { height: this.state.animatedHeight }, customStyles.datePickerCon]}
                                    >
                                        {this.renderPicker()}
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={this.onPressCancel}
                                            style={[Style.btnText, Style.btnCancel, customStyles.btnCancel]}
                                        >
                                            <Text
                                                style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextCancel]}
                                            >
                                                {'取消'}
                                            </Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={this.onPressConfirm}
                                            style={[Style.btnText, Style.btnConfirm, customStyles.btnConfirm]}
                                        >
                                            <Text style={[Style.btnTextText, customStyles.btnTextConfirm]}>{'确定'}</Text>
                                        </TouchableHighlight>
                                    </Animated.View>
                                </TouchableHighlight>
                            </TouchableHighlight>
                        </View>
                    </Modal>
                </View>
            </TouchableHighlight>
        );
    }
}

RangePicker.defaultProps = {
    mode: 'date',
    date: '',
    customStyles: {},
    listData:[],
    startY: 2000,
    startM: 1,
};

RangePicker.propTypes = {
    customStyles: React.PropTypes.object,
    onDateChange: React.PropTypes.func,
    onOpenModal: React.PropTypes.func,
    onCloseModal: React.PropTypes.func,
    placeholder: React.PropTypes.string,
};

export default RangePicker;

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

class MonthPicker extends Component {
    constructor(props) {
        super(props);

        // 可选年
        let years = [];
        for (let i = this.props.endY; i >= this.props.startY; i--) {
            years.push(i + '年')
        }
        // 可选月
        let months = [];
        for (let i = this.props.endM; i > 0; i--) {
            months.push(i + '月')
        }
        this.state = {
            modalVisible: false,
            animatedHeight: new Animated.Value(0),
            years,
            months,
            selY: this.props.selY,
            selM: this.props.selM,
        };

        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderPicker = this.renderPicker.bind(this)
        this.getDateStr = this.getDateStr.bind(this)
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
            let month = this.state.selM < 10 ? '0' + this.state.selM : this.state.selM
            let yearMonth =  this.state.selY + '' + month
            this.props.onDateChange(this.state.selY, this.state.selM, yearMonth);
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
                    selectedValue={this.state.selY + '年'}
                    onValueChange={(y) => {
                        y = parseInt(y)
                        // 当前选择时间
                        // 起始月份,起始第几天,选择月份,选择第几天
                        let selM = this.state.selM;
                        // 生成月份数组
                        let months = [];
                        // 当前年份 <= 起始年份，如果小于起始年份，重置数据
                        let startM = 12;
                        let endM = 1;
                        if (y == this.props.startY) {
                            selM = selM < this.props.startM ? this.props.startM : selM;
                            endM = this.props.startM;
                        } else if (y == this.props.endY) {
                            selM = selM > this.props.endM ? this.props.endM : selM;
                            startM = this.props.endM;
                        }

                        for (let i = startM; i >= endM; i--) {
                            months.push(i + '月');
                        }

                        // 设置当前选中时间，对应月份，和天数进行更新
                        this.setState({
                            selY: y,
                            selM,
                            months,
                        });
                    }}>
                    {
                        this.state.years.map((year) => {
                            return <Picker.Item label={'' + year} value={year} key={year} />
                        })
                    }
                </Picker>
            </View>
            <View style={{ flex: 1 }}>
                <Picker
                    selectedValue={this.state.selM + '月'}
                    onValueChange={(m) => {

                        // 设置选择时间
                        this.setState({
                            selM: parseInt(m),
                        });
                    }}
                >
                    {
                        this.state.months.map((month) => {
                            return <Picker.Item label={'' + month} value={month} key={month} />
                        })
                    }
                </Picker>
            </View>
        </View>);
    }
    getDateStr() {
        let month = this.props.selM < 10 ? '0' + this.props.selM : this.props.selM
        return this.props.selY + '年' + month+'月'
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

MonthPicker.defaultProps = {
    mode: 'date',
    date: '',
    customStyles: {},
    endY: new Date().getFullYear(),
    endM: new Date().getMonth() + 1,
    selY: new Date().getFullYear(),
    selM: new Date().getMonth() + 1,
    startY: 2000,
    startM: 1,
};

MonthPicker.propTypes = {
    customStyles: React.PropTypes.object,
    onDateChange: React.PropTypes.func,
    onOpenModal: React.PropTypes.func,
    onCloseModal: React.PropTypes.func,
    placeholder: React.PropTypes.string,
};

export default MonthPicker;

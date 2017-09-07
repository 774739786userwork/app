import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  ListView,
  Dimensions,
  TouchableHighlight,
  InteractionManager,
  FlatList,
  Alert,
  Linking,
  TouchableOpacity,
  NativeModules,
  NativeAppEventEmitter,
  DatePickerAndroid,
  Platform
} from 'react-native';
import { Iconfont, LoadingView, Toast, LoginInfo } from 'react-native-go';
/**
 * 
 * 填写 页面
 */

class SelectInputContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: state.params.item.title,
      headerRight: (<TouchableOpacity onPress={() => navigation.state.params.headerRightPress()}>
        <View style={{ marginRight: 8 }}>
          <Iconfont
            icon={'e6a3'} // 图标
            iconColor={'#fff'}
            iconSize={22}
          />
        </View>
      </TouchableOpacity>)
    };
  };
  constructor(props) {
    super(props);
    this.headerRightPress = this.headerRightPress.bind(this)
    this.inputValue = '';
    this.state = {
      defaultValue: '',
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRightPress: this.headerRightPress,
    })
  }
  headerRightPress = () => {
    const { navigation } = this.props;
    let { item } = navigation.state.params
    let newItem = {};
    newItem.title = item.title;
    newItem.value = this.value;
    newItem.input = true; 
    navigation.state.params.callback(newItem);
    navigation.goBack();
  }

  render() {
    const { item } = this.props.navigation.state.params
    let defaultValue = ('请输入' + item.title) === item.value ? null : item.value;
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <TextInput style={{ borderColor: '#D4D4D4',
          borderBottomWidth: StyleSheet.hairlineWidth,
          backgroundColor: '#fff',
          padding: 4, height: 100 }}

          placeholder={'请输入' + item.title}
          defaultValue={defaultValue}
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'#999'}
          multiline={true}
          onChangeText={(values) => {
            this.inputValue = values;
          }}
        />
      </View >
    );
  }
}
export default SelectInputContainer;

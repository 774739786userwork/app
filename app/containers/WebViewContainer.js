import React from 'react';
import {
  WebView,
  View,
  TouchableOpacity
} from 'react-native';

import { Iconfont, Toast, LoadingView } from 'react-native-go';

class WebViewContainer extends React.Component {
  static navigationOptions = {
    header: null

  };
  constructor(props) {
    super(props)
    this.goBackAction = this.goBackAction.bind(this)
  }

  goBackAction() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    return <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <WebView style={{ flex: 1 }} 
            source={{ uri: 'http://www.duobangjc.com/' }}  
            domStorageEnabled={true}
            javaScriptEnabled={true}
            startInLoadingState={true}/>
      <View style={{ position: 'absolute', top: 22, left: 12 }}>
        <TouchableOpacity onPress={this.goBackAction}>
          <Iconfont icon='e630' iconSize={24} iconColor={'#f2f2f2'} label={'返回'} labelSize={18} labelColor={'#f2f2f2'} />
        </TouchableOpacity>
      </View>
    </View>;
  }
}

export default WebViewContainer;

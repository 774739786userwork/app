import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default class LeftProductTabComponet extends React.Component {
  constructor(props) {
    super(props)
    this.renderSectionListItem = this.renderSectionListItem.bind(this);
    this.state = {
      preSelect: undefined
    }
    this.preSelect = undefined
  }
  sectionAction(item) {
   // this.props.sectionAction && this.props.sectionAction(item)
    this.setState({ preSelect: item.factoryName })
  }
  renderSectionListItem(item) {
    let factoryName = item.factoryName
    let preSelect = this.state.preSelect
    if (!this.preSelect) {
      this.preSelect = factoryName
    }
    preSelect = preSelect ? preSelect : this.preSelect
    return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${factoryName}`}>
      <View>
        <View style={{ width: 100, padding: 12, backgroundColor: preSelect != factoryName ? '#fff' : '#f9f9f9' }}>
          <Text style={{ color: preSelect != factoryName ? '#333' : '#0081d4' }}>{item.factoryName}</Text>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, width: 100, backgroundColor: '#f9f9f9' }} />
      </View>
    </TouchableOpacity>
  }
  render() {
    return <ScrollView>
      {
        this.props.data.map((item) => this.renderSectionListItem(item))
      }
    </ScrollView>
  }
}
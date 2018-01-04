import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
  InteractionManager,
  ScrollView,
  TouchableOpacity,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import { FetchManger, LoginInfo, LoadingView, Toast } from 'react-native-go'
import LoadingListView from '../../../components/LoadingListView'
import * as DateUtils from '../../../utils/DateUtils'
import YearPicker from '../../../components/YearPicker'

class LeftTabComponet extends React.Component {
    constructor(props) {
      super(props)
      this.renderSectionListItem = this.renderSectionListItem.bind(this);
      this.state = {
        preSelect: undefined
      }
      this.preSelect = undefined
    }
    sectionAction(item) {
      this.props.sectionAction && this.props.sectionAction(item)
      this.setState({ preSelect: item.serieslId })
    }
    renderSectionListItem(item) {
      let serieslId = item.serieslId;
      
      let preSelect = this.state.preSelect;
  
      if (!this.preSelect) {
        this.preSelect = serieslId
      }
      preSelect = preSelect ? preSelect : this.preSelect
  
      return <TouchableOpacity onPress={this.sectionAction.bind(this, item)} key={`index_${serieslId}`}>
        <View>
          <View style={{ width: 100, height: 40, padding: 12, backgroundColor: preSelect != serieslId ? '#fff' : '#f9f9f9' }}>
            <Text style={{ color: preSelect != serieslId ? '#333' : '#0081d4' }}>{item.serieslName}</Text>
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

//各系列分厂年比较
class CompareSeriesYearPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        salerList: [],
      }
    }

    componentDidMount() {

    }

    render() {
        return (<View style={{ flex: 1 }}>
          <View style={{
            paddingTop: 6,
            paddingBottom: 6,
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            flexDirection: 'row'
          }}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => {
    
            }}>
              <Iconfont
                icon={'e688'} // 图标
                iconColor={'#aaa'}
                iconSize={26} />
            </TouchableOpacity>
            <YearPicker
              style={{ width: 120 }}
              customStyles={{
                dateText: {
                  fontSize: 18,
                  color: '#000',
                }
              }}
              onDateChange={(selY, ymStr) => {
              }}
            />
            <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => {
    
            }}>
              <Iconfont
                icon={'e657'} // 图标
                iconColor={'#aaa'}
                iconSize={26} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
            <View style={{ width: 90, justifyContent: 'center', alignItems: 'center' }}>
              
            </View>
            <View style={{ flex: 1, backgroundColor: '#f9f9f9', flexDirection: 'column' }}>
              <View style={{ margin: 10, backgroundColor: '#fff', flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#66b3e5' }}>
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'工厂'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'销量'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'金额(万)'}</Text>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
                  <Text style={{ fontSize: 12, paddingLeft: 2, paddingRight: 2, paddingTop: 10, paddingBottom: 10, flex: 1, textAlign: 'center', flex: 1, color: '#fff' }}>{'占比%'}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#f9f9f9' }} />
              </View>
            </View>
          </View >
        </View >
        );
      }
}

export default CompareSeriesYearPage;
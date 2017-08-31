import React, { Component, } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    View,
    ListView,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    InteractionManager,
    FlatList,
    Alert,
    Linking,
    ActivityIndicator
} from 'react-native';

import { Iconfont, LoadingView,LoginInfo, FetchManger,Toast } from 'react-native-go';
import LoadingListView from '../../components/LoadingListView'
import SearchBar from '../../components/SearchBar';
import * as ValidateUtils from '../../utils/ValidateUtils';

const WINDOW_WIDTH = Dimensions.get('window').width;
var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

let data;
class CustContactContainer extends Component{
    static navigationOptions = ({ navigation }) => {
        return{
            title:'客户联系人',
        };
    };

    constructor(props){
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.getContactList = this.getContactList.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this.searchText = '';
        this.state = {
            loading:false,
            loadMore:false,
            listData:[]
        }
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.getContactList(false)
        });
    }

    getContactList(loadMore,contactMobile,page = 1){
        const token = LoginInfo.getUserInfo().token;
        const user_id = LoginInfo.getUserInfo().user_id;
        const orgId = LoginInfo.getUserInfo().organization_id;

        let reqParams = { token, user_id, orgId};
        reqParams.page = page;
        reqParams.rows = 10;
        if(contactMobile){
            reqParams.contactMobile = contactMobile;
        }
        // let loadMore = page > 1;
        if(loadMore){
            this.setState({ loadMore:true });
        }else{
            this.setState({ loading:true});
        }

        InteractionManager.runAfterInteractions(() => {
            FetchManger.getUri('mobileServiceManager/customers/selectContacts.page',reqParams).then((responseData) => {
                if(responseData.status === '0' || responseData.status === 0){
                    data = responseData.data;
                    let contactList = data.contactLists;
                    if(loadMore){
                        if(data){
                            let conList = this.state.listData.concat(contactList);
                            this.setState({ listData:conList,loadMore:false});
                        }else{
                            this.setState({ loadMore:false});
                        }
                    }else {
                        this.setState({ listData: contactList ? contactList : [], loading: false });
                    }
                }else{
                    if (loadMore) {
                        this.setState({ loadMore: false });
                    } else {
                        this.setState({ loading: false });
                    }
                    Toast.show(responseData.msg);
                }
            }).catch((error) => {
                console.log(error)
                if(loadMore){
                    this.setState({ loadMore:false});
                }else{
                    this.setState({ loading:false});
                }
                Toast.show("网络错误");
            })
        });
    }

    onSearchAction(txt){
        InteractionManager.runAfterInteractions(() => {
            this.getContactList(false,txt)
        });
    }

    onTelAction(type, title, customersName, telephone) {
        Alert.alert(customersName + '', telephone,
          [
            {
              text: title, onPress: () => {
                let url = type + telephone;
                Linking.canOpenURL(url).then(supported => {
                  if (supported) {
                    Linking.openURL(url);
                  } else {
                    console.log('无法打开该URI: ' + this.props.url);
                  }
                });
              }
            },
            { text: '取消', onPress: () => console.log('Cancel Pressed!') }
          ]
        )
      }

    //加载更多
    onEndReached() {
        const start = this.state.listData.length;
        InteractionManager.runAfterInteractions(() => {
            if (start >= 10 && start % 10 === 0) {
                this.getContactList(true, this.searchText, start / 10 + 1)
            }
        });
    }

    //跳转至客户详情页面
    _onlistItemPress(rowdata) {
        const { navigate } = this.props.navigation;
        const customer_id = rowdata.customerId;
        let item = { customer_id };
        navigate('CustDetail', item);
    }

    _renderItem = (item,index) => {
        return(
            <TouchableHighlight onPress={this._onlistItemPress.bind(this,item)} key={`row_${index}`}>
                <View style={{ backgroundColor: '#fff' }} >
                    <View style={{ flexDirection:'row',padding:5}}>
                        <View style={{ flex: 1, paddingLeft: 10, }}>
                            <Text style={{ color: '#333', fontSize: 16 }}>{`${item.contactName}`}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.onTelAction.bind(this, 'tel:', '拨打电话', item.contactName, item.mobile1)}>
                                <View style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#fb6d23' }}>
                                    <Iconfont fontFamily={'OAIndexIcon'}
                                        icon={'e68e'} // 图标
                                        iconColor={'#fff'}
                                        iconSize={14}
                                    />
                                </View>
                            </TouchableOpacity>
                            <Text style={{ color: '#666666', fontSize: 16,alignItems: 'center', justifyContent: 'center',margin:5 }}>{`${item.mobile1}`}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection:'column',padding:5}}>
                        <View style={{paddingLeft: 10}}>
                            <Text style={{ color: '#666666', fontSize: 16 }}>{`${item.customerName}`}</Text>
                        </View>

                        <View style={{paddingLeft: 10}}>
                            <Text style={{ color: '#666666', fontSize: 16 }}>{`${item.customerAddress}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />
                </View>
            </TouchableHighlight>
        );
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
                <SearchBar
                    onSearchChange={(text) => {
                        this.searchText = text.nativeEvent ? text.nativeEvent.text : text;
                        if (ValidateUtils.checkMobile(text)) {
                            this.onSearchAction(text);
                        }
                    }}
                    height={30}
                    onFocus={() => console.log('On Focus')}
                    onClose={() => {
                        this.onSearchAction()
                    }}
                    placeholer={'请输入手机号码查询'}
                    autoCorrect={false}
                    padding={8}
                    returnKeyType={'search'}
                />
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#d9d9d9' }} />

                <View style={{ flex:1 }}>
                    <LoadingListView
                        loading={this.state.loading}
                        loadMore={this.state.loadMore}
                        listData={dataSource.cloneWithRows(this.state.listData)}
                        renderRowView={this._renderItem}
                        onEndReached={this.onEndReached} />
                </View>
            </View>
        );
    }
}

export default CustContactContainer
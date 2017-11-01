import React from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableHighlight,
    Image,
    StyleSheet,
    InteractionManager,
    TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-swiper'
import NavigationUtil from '../../utils/NavigationUtil';
import GridView from '../../components/GridView';
import HomeBar from '../../components/HomeBar'
import { Iconfont, Toast, FetchManger, LoginInfo, Spinner } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;

const HomeItem = [
    { name: '各系列分厂比较', open: false, typeName: 'SelectLadingbills', image: require('../../imgs/work/s_gexiliefengchangbijiao.png') },
    { name: '核心系列', open: false, typeName: 'SelectDeliveryOrder', image: require('../../imgs/work/s_kexinxilie.png') },
    { name: '客户产品系列', open: false, typeName: 'PurchaseOrderInfo', image: require('../../imgs/work/s_kehucanpingxilie.png') },
    { name: '大客户', open: false, typeName: 'GetCarstockProductList', image: require('../../imgs/work/s_dakehu.png') },
    { name: '新发展客户', open: false, typeName: 'GetCarSurplusGoodsList', image: require('../../imgs/work/s_xinfazhankehu.png') },
    { name: '活跃客户', open: false, typeName: 'UnLoadBillDetailList', image: require('../../imgs/work/s_huyuekehu.png') },
    { name: '分段客户', open: false, typeName: 'QueryReturnLists', image: require('../../imgs/work/s_fengduankehu.png') },
    { name: '产品大客户', open: true, typeName: 'BigCustomerPage', image: require('../../imgs/work/s_canpingdakehu.png') },
    { name: '产品销量', open: false, typeName: 'ListCustomers', image: require('../../imgs/work/s_canpingxiaoliang.png') },
    { name: '产品趋势', open: false, typeName: 'NewReturnGood', image: require('../../imgs/work/s_canpingqushi.png') },
    { name: '产品业务排名', open: false,typeName: 'PurchaseOrder', image: require('../../imgs/work/s_yewuyuanpaiming.png') },
    { name: '数据预测', open: false, typeName: 'AddBalanceAccouts', image: require('../../imgs/work/s_shujuyuce.png') },
];

const styles = {
    wrapper: {
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width: WINDOW_WIDTH,
        flex: 1,
        backgroundColor: 'transparent'
    },

    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)'
    },

    loadingImage: {
        width: 60,
        height: 60
    },
    gridview: {
    },
    itembtnview: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WINDOW_WIDTH / 3,
        height: WINDOW_WIDTH / 3,
        borderBottomColor: '#dedede',
        borderRightColor: '#dedede',
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth
    },
    showText: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
}
const Slide = props => {
    return (<View style={styles.slide} key={'b_image_' + props.i}>
        <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={props.onSlideAction}
        >
            <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={require('../../imgs/ic_default.png')} />
            {
                !props.loaded && <View style={styles.loadingView} />
            }
        </TouchableOpacity>
    </View>)
}

class S_WorkContainer extends React.Component {

    static navigationOptions = {
        title: '首页',
        header: null,
        tabBarIcon: ({ tintColor }) => (
            <Iconfont icon='e6aa' iconSize={24} iconColor={tintColor} />
        ),
    };
    constructor(props) {
        super(props)
        this._onMenuClick = this._onMenuClick.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.loadHandle = this.loadHandle.bind(this)
        this.onRightButtonPress = this.onRightButtonPress.bind(this)

        this.state = {
            imgList: [
                '',
                '',
            ],
            loadQueue: [0, 0, 0, 0],
            swiperShow: false
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0)
    }

    onSlideAction() {
        const { navigate } = this.props.navigation;
        navigate('WebView');
    }


    loadHandle(i) {
        let loadQueue = this.state.loadQueue
        this.setState({
            loadQueue
        })
    }
    _onMenuClick(item) {
        const { navigate } = this.props.navigation;
        if (!item.open) {
            Toast.show('该功能还未开放')
            return
        }else {
            navigate(item.typeName);
        }
    }
    _renderItem(item, index) {
        return (
            <TouchableHighlight underlayColor='#C8C7CC' onPress={() => this._onMenuClick(item)} key={index}>
                <View style={styles.itembtnview}>
                    <Image style={{ width: 42, height: 42 }} source={item.image} />
                    <Text style={styles.showText}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }
    onRightButtonPress() {
        const { navigate } = this.props.navigation;
        navigate('QR');
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <HomeBar title='报表'/>
                {
                    this.state.swiperShow ? <Swiper
                        nextButton={<Text style={{
                            fontSize: 50,
                            color: '#c4c4c4',
                            fontFamily: 'Arial'
                        }}>›</Text>}
                        prevButton={<Text style={{
                            fontSize: 50,
                            color: '#c4c4c4',
                            fontFamily: 'Arial'
                        }}>‹</Text>}
                        loadMinimal
                        loadMinimalSize={1}
                        showsPagination={false}
                        style={styles.wrapper}
                        height={134}
                        loop={true}
                        showsButtons={true}
                        autoplay={true}>
                        {
                            this.state.imgList.map((item, i) => <Slide
                                loadHandle={this.loadHandle}
                                onSlideAction={this.onSlideAction.bind(this)}
                                loaded={!!this.state.loadQueue[i]}
                                uri={item}
                                i={i}
                                key={i} />)
                        }
                    </Swiper> : null
                }
                <View style={{ height: 12, backgroundColor: '#f2f2f2' }} />
                <GridView
                    style={styles.gridview}
                    items={Array.from(HomeItem)}
                    itemsPerRow={3}
                    renderItem={this._renderItem}
                />
            </View >
        );
    }
}

export default S_WorkContainer;
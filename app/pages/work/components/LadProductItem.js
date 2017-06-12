
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
const ic_product = require('../../../imgs/ic_product.png')
import { Iconfont, LoadingView } from 'react-native-go';

class LadProductItem extends React.Component {
    constructor(props) {
        super(props)
        this.updateNewCount = this.updateNewCount.bind(this);
        this.state = {
            count: props.item.real_loading_count ? props.item.real_loading_count : 0
        }
    }
    updateNewCount(newCount) {
        const { onUpdate, item } = this.props
        if (newCount < 0) {
            newCount = 0;
        }
        if (newCount > this.state.maxCount) {
            newCount = this.state.maxCount;
        }
        this.setState({ count: newCount });
        item.real_loading_count = newCount;
        onUpdate && onUpdate(item);
    }
    render() {
        const { item } = this.props;

        return (<View style={{ backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                    <Image style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} source={ic_product} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#999', fontSize: 12, marginRight: 8 }}>{`${item.specifications}`}</Text>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'仓库库存：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.housestock}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'订单数量：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.purchase_count}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'余货：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.remain_count}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'总数：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.product_total_count}`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ position: 'absolute', bottom: 0, right: 12, height: 26, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ flex: 2, textAlign: 'right', color: '#999', fontSize: 12 }}>实提</Text>
                    <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: 8, marginRight: 6 }} onPress={() => {
                            this.updateNewCount(this.state.count - 1);
                        }}>
                            <Iconfont
                                icon={'e6ba'} // 图标
                                iconColor={'#0081d4'}
                                iconSize={22} />
                        </TouchableOpacity>
                        <TextInput style={{ width: 40, height: 26, fontSize: 14, textAlign: 'center', color: '#666', borderRadius: 8, padding: 0, borderWidth: 1, borderColor: '#c4c4c4' }}
                            underlineColorAndroid={'transparent'}
                            value={'' + this.state.count}
                            in
                            defaultValue={'' + this.state.count}
                            onChangeText={(newCount) => {
                                this.updateNewCount(parseInt(newCount));
                            }}
                        />
                        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
                            this.updateNewCount(this.state.count + 1);
                        }}>
                            <Iconfont
                                icon={'e6b9'} // 图标
                                iconColor={'#0081d4'}
                                iconSize={22}
                            /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>)
    }

}

export default LadProductItem;
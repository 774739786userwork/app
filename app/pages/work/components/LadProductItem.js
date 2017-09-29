
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
import ImageView from '../../../components/ImageView'
import { Iconfont, LoadingView } from 'react-native-go';

class LadProductItem extends React.Component {
    constructor(props) {
        super(props)
    }
   
    render() {
        const { item } = this.props;
        item.loading_quantity = item.loading_quantity ? item.loading_quantity : 0;
        
        return (<View style={{ backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                    <ImageView source={{ uri: item.image }} style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'仓库库存：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.housestock}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12, marginRight: 8 }}>{`${item.specifications}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'余货：'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.remain_count}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'订单数量：'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.purchase_count}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'总数：'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.loading_quantity ? item.loading_quantity : 0}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'实提:'}</Text>
                            <Text style={{ color: '#f80000', fontSize: 12 }}>{`${item.real_loading_count ? item.real_loading_count : 0}`}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>)
    }

}

export default LadProductItem;

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

    render() {
        const { item,selectItem } = this.props;
        let d_returnQuantity = item.returnQuantity ? item.returnQuantity : 0;
        let returnQuantity  = selectItem.returnQuantity ? selectItem.returnQuantity : d_returnQuantity;
        let realPrice = selectItem.realPrice ? selectItem.realPrice : item.realPrice;

        return (<View style={{ backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                    <ImageView source={{ uri: item.productImage }} style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 24, paddingLeft: 12, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.productName}`}</Text>
                        
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'最小单位：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.minUnit}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'进货单价：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.purchasePrice}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'实际单价：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${realPrice}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'退货数：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${returnQuantity}`}</Text>
                        </View>
                    </View>
                </View>
              
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>)
    }

}

export default LadProductItem;
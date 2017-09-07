
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
import * as NumberUtils from '../../../utils/NumberUtils';

class LadProductItem extends React.Component {

    render() {
        const { item,selectItem } = this.props;
        
        let num =  (item.sale_quantity ? parseInt(item.sale_quantity) : 0) + (item.gifts_quantity ? parseInt(item.gifts_quantity) : 0);
        let numberCarsh = NumberUtils.FloatAdd(NumberUtils.FloatMul(item.product_price,item.sale_quantity) ,  NumberUtils.FloatMul(item.product_foregift, num));
        if(!selectItem){
            num = 0;
            numberCarsh = 0.0;
        }
        return (<View style={{ backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', paddingLeft: 12, }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 110 }}>
                    <ImageView source={{ uri: item.product_image }} style={{ width: 90, height: 90, margin: 2, borderWidth: 1, borderColor: '#c4c4c4', padding: 4 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 24, paddingLeft: 12,paddingRight:8, marginBottom: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 16 }}>{`${item.product_name}`}</Text>
                        <View style={{flex:1}}/>
                        <Text style={{ color: '#999', fontSize: 12 }}>{`${item.product_specifications}`}</Text>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'押金：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.product_foregift}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'数量：'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${num}`}</Text>
                        </View>
                    </View>
                    <View style={{ height: 24, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{''}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${item.product_price}元`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: '#999', fontSize: 12 }}>{'金额:'}</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>{`${numberCarsh}`}</Text>
                        </View>
                    </View>
                </View>
              
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, marginTop: 4, flex: 1, backgroundColor: '#c4c4c4' }} />
        </View>)
    }

}

export default LadProductItem;
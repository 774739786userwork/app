/**
 * @desc 关于界面
 */
import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
    Dimensions,
    View
} from 'react-native';
var WINDOW_WIDTH = Dimensions.get('window').width;

class AboutPageContainer extends React.Component {
    static navigationOptions = {
        title: '关于',
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
                <ScrollView contentContainerStyle={{ flex: 1, padding: 12, alignItems: 'center', justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginTop:12,justifyContent: 'center' }}>
                        <Image style={{
                            height: 100,
                            width: 130,
                        }} source={require('../../imgs/logo.png')}></Image>
                    </View>
                    <View style={{ marginBottom:30,marginTop:30,height: StyleSheet.hairlineWidth, backgroundColor: '#dedede', width: WINDOW_WIDTH }} />
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text >{'     多邦集团创立于2002年，总部设在广州，是集开发、生产、销售、服务于一体的大型高科技建筑材料制造企业。多邦集团旗下拥有广州市多邦建筑装饰材料有限公司、深圳市多邦建筑装饰材料有限公司、长沙市恩多邦建筑装饰材料有限公司、长沙市善多邦建筑装饰材料有限公司、武汉市丽多邦建筑装饰材料有限公司、成都市美邦建筑装饰材料有限公司，现有员工一千多人，拥有一批专业工程师，技术力量雄厚。'}</Text>
                    </View>
                    <View style={{flex:1}}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text>{'客服热线：'}</Text>
                        <Text>{'400-602-222'}</Text>
                    </View>
                    <View style={{ marginBottom:20,marginTop:20,height: StyleSheet.hairlineWidth, backgroundColor: '#dedede', width: WINDOW_WIDTH }} />
                    <Text>{'所有 ©2017 多邦建筑装饰材料有限公司'}</Text>
                    <Text style={{marginBottom:30,marginTop:8}}>{' ICP备案号：湘ICP备15009650-1号'}</Text>
                </ScrollView>
            </View >
        );
    }
}

export default AboutPageContainer;
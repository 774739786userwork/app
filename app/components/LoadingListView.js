import React from 'react';
import {
    ActivityIndicator,
    Text,
    View,
    ListView,
    Dimensions
} from 'react-native';
import { LoadingView } from 'react-native-go';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default LoadingListView = ({loading, loadMore, listData, renderRowView, onEndReached }) => {
    return (<View style={{flex:1}}>
        {
            loading ?
                <LoadingView /> :
                (listData._cachedRowCount == 0 ?
                    <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                        <Text> 暂无数据</Text>
                    </View>
                    :
                    <ListView
                        enableEmptySections={true}
                        dataSource={listData}
                        renderRow={renderRowView}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={38}
                        renderFooter={() =>
                            loadMore ? <View style={{
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}>
                                <ActivityIndicator
                                    size="large"
                                    color="#118cd7"
                                />
                            </View> : null}
                    />
                )

        }
    </View>);

}
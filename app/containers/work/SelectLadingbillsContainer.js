
import React from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import ScrollableTabView, {
    DefaultTabBar
} from 'react-native-scrollable-tab-view';

import SelectLadingbillsPage from '../../pages/work/SelectLadingbillsPage';
import UnAuditedLadingbillsPage from '../../pages/work/UnAuditedLadingbillsPage'
/**
 * 订货单查询
 */
class SelectLadingbillsContainer extends React.Component {
    static navigationOptions = {
        title: '提货单查询',
    };
    render() {
        return (<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollableTabView
                renderTabBar={() => (
                    <DefaultTabBar tabStyle={{ paddingBottom: 0}} textStyle={{ fontSize: 16 }} style={{height: 40}} />
                )}
                tabBarBackgroundColor="#fcfcfc"
                tabBarUnderlineStyle={{ backgroundColor: '#3e9ce9', height: 2 }}
                tabBarActiveTextColor="#3e9ce9"
                tabBarInactiveTextColor="#aaaaaa"
            >
                <UnAuditedLadingbillsPage key={'0'} tabLabel={'未审核'} {...this.props} />
                <SelectLadingbillsPage key={'1'} tabLabel={'已审核'} {...this.props} />
            </ScrollableTabView>
        </View>);
    }
}

const mapStateToProps = (state) => {
    const { selectLadingbills, purchaseOrderInfo } = state;
    return {
        selectLadingbills, purchaseOrderInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    const action = bindActionCreators(actions, dispatch);
    return {
        action
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLadingbillsContainer);

/**
 import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Iconfont } from 'react-native-go';
import * as actions from '../../actions/Actions';

import SelectLadingbillsPage from '../../pages/work/SelectLadingbillsPage';


class SelectLadingbillsContainer extends React.Component {
  static navigationOptions = {
    title: '提货单查询',
  };
  render() {
    return <SelectLadingbillsPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const { selectLadingbills } = state;
  return {
    selectLadingbills
  };
};

const mapDispatchToProps = (dispatch) => {
  const action = bindActionCreators(actions, dispatch);
  return {
    action
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLadingbillsContainer);


 */
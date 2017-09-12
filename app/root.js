import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import rootSaga from './sagas/index';
import App from './containers/app';

const store = configureStore();

//是否显示计量人
global.userStyle = true;
/**
 * 南北厂正式测试环境地址
 */
//global.baseUrl = "http://app.duobangjc.com:1009/csbboss/";
global.baseUrl = "http://app.duobangjc.com:8080/bboss/";

/**
 * 常德、喜乐家正式环境地址
 */
// global.baseUrl = "http://app.duobangjc.com:8081/bboss/";
store.runSaga(rootSaga);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
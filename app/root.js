import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import rootSaga from './sagas/index';
import App from './containers/app';

const store = configureStore();

global.baseUrl = "http://112.74.47.41:1009/csbboss/";

store.runSaga(rootSaga);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
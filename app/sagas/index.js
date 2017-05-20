import { fork } from 'redux-saga/effects';
import { watchRequestLogin } from './login'

export default function* rootSaga() {
    yield [fork(watchRequestLogin)];
}
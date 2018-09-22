import { all } from 'redux-saga/effects';

import authSaga from './authSaga';
import appSaga from './appSaga';
import createAppSaga from './createAppSaga';

export default function* rootSaga() {
	yield all([authSaga(), appSaga(), createAppSaga()]);
}

import { all } from 'redux-saga/effects';

import authSaga from './authSaga';
import appSaga from './appSaga';
import createAppSaga from './createAppSaga';
import deleteAppSaga from './deleteAppSaga';

export default function* rootSaga() {
	yield all([authSaga(), appSaga(), createAppSaga(), deleteAppSaga()]);
}

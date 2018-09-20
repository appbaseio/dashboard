import { takeEvery, call, put } from 'redux-saga/effects';
import { DELETE_APP } from '../constants';

import { removeAppFromList, removeAppMetrics, removeAppOwner } from '../actions';

function* deleteAppWorker(options) {
	yield put(removeAppFromList(options.appName));
	yield put(removeAppMetrics(options.appId));
	yield put(removeAppOwner(options.appName));
}

function* watchDeleteApp(action) {
	if (action.type === DELETE_APP.LOAD) {
		yield call(deleteAppWorker, action.payload);
	}
}

export default function* deleteAppSaga() {
	yield takeEvery(DELETE_APP.LOAD, watchDeleteApp);
}

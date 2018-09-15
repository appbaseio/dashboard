import { takeEvery, call, put } from 'redux-saga/effects';
import { CREATE_APP } from '../constants';
import { getCreateApp } from '../utils';
import { setCreateApp, createAppFail } from '../actions';

function* createAppWorker(options) {
	try {
		const response = yield call(getCreateApp, options);
		yield put(setCreateApp(response));
	} catch (e) {
		yield put(createAppFail(e));
	}
}

function* watchCreateApp(action) {
	if (action.type === CREATE_APP.LOAD) {
		yield call(createAppWorker, action.payload);
	}
}

export default function* createAppSaga() {
	yield takeEvery(CREATE_APP.LOAD, watchCreateApp);
}

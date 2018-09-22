import { takeEvery, call, put } from 'redux-saga/effects';
import { CREATE_APP } from '../constants';
import { getCreateApp, getAppsMetrics } from '../utils';
import {
 setCreateApp, createAppFail, appendApp, setAppsMetrics,
} from '../actions';

import { getUserPermissions } from '../batteries/modules/actions';

function* createAppWorker(options) {
	try {
		const response = yield call(getCreateApp, options);
		const metrics = yield call(getAppsMetrics);
		yield put(setAppsMetrics(metrics));
		yield put(appendApp({ [options.appName]: String(response.id) }));
    yield (put(getUserPermissions()));
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

import {
 take, takeEvery, call, put,
} from 'redux-saga/effects';
import { APPS } from '../constants';
import { getAppsMetrics, getAppsOwners } from '../utils';
import {
 setAppsMetrics, setAppsMetricsError, setAppsOwners, setAppsOwnersError,
} from '../actions';

function* appWorker() {
	try {
		const metrics = yield call(getAppsMetrics);
		yield put(setAppsMetrics(metrics));
	} catch (e) {
		yield put(setAppsMetricsError(e));
	}
}

function* appsOwnersWorker() {
	try {
		const owners = yield call(getAppsOwners);
		yield put(setAppsOwners(owners));
	} catch (e) {
		yield put(setAppsOwnersError(e));
	}
}

export default function* appSaga() {
	yield takeEvery(APPS.LOAD_OWNERS, appsOwnersWorker);
	yield take(APPS.LOAD);
	yield call(appWorker);
}

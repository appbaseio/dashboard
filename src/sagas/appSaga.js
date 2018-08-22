import { take, call, put } from 'redux-saga/effects';
import { APPS } from '../constants';
import { getAppsMetrics } from '../utils';
import { setAppsMetrics, setAppsMetricsError } from '../actions';

function* appWorker() {
	try {
		const metrics = yield call(getAppsMetrics);
		yield put(setAppsMetrics(metrics));
	} catch (e) {
		yield put(setAppsMetricsError(e));
	}
}

export default function* appSaga() {
	yield take(APPS.LOAD);
	yield call(appWorker);
}

import { take, takeEvery, call, put } from 'redux-saga/effects';
import { APPS } from '../constants';
import { getAppsOwners, getAppsOverview } from '../utils';
import {
	setAppsOwners,
	setAppsOwnersError,
	setAppsOverview,
	setAppsOverviewError,
} from '../actions';

function* appWorker() {
	try {
		const appsOverview = yield call(getAppsOverview);
		yield put(setAppsOverview(appsOverview));
	} catch (e) {
		yield put(setAppsOverviewError(e));
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

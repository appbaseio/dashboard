// @flow
import { USER, APPS } from '../constants';
import { createAction } from '../batteries/modules/actions/utils';

export function loadUser(): Object {
	return createAction(USER.LOAD, null, null, null);
}

export function setUser(user: Object): Object {
	return createAction(USER.LOAD_SUCCESS, user, null, null);
}

export function setUserError(error: Object): Object {
	return createAction(USER.LOAD_FAIL, null, error, null);
}

export function loadApps(apps: Object): Object {
	return createAction(APPS.LOAD, apps, null, null);
}

export function setAppsMetrics(metrics: Object): Object {
	return createAction(APPS.LOAD_METRICS_SUCCESS, metrics, null, null);
}

export function setAppsMetricsError(error: Object): Object {
	return createAction(APPS.LOAD_METRICS_FAIL, null, error, null);
}

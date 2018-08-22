// @flow
import { USER, APPS } from '../constants';

export function loadUser(): Object {
	return {
		type: USER.LOAD,
	};
}

export function setUser(user: Object): Object {
	return {
		type: USER.LOAD_SUCCESS,
		user,
	};
}

export function setUserError(error: Object): Object {
	return {
		type: USER.LOAD_FAIL,
		error,
	};
}

export function loadApps(apps: Object): Object {
	return {
		type: APPS.LOAD,
		apps,
	};
}

export function setAppsMetrics(metrics: Object): Object {
	return {
		type: APPS.LOAD_METRICS_SUCCESS,
		metrics,
	};
}

export function setAppsMetricsError(error: Object): Object {
	return {
		type: APPS.LOAD_METRICS_FAIL,
		error,
	};
}

// @flow
import { USER, APPS, CREATE_APP } from '../constants';

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

export function createApp(options:Object):Object {
	return {
		type: CREATE_APP.LOAD,
		options,
	};
}

export function setCreateApp(data:Object):Object {
	return {
		type: CREATE_APP.CREATE_APP_SUCCESS,
		data,
	};
}

export function createAppFail(error:Object):Object {
	return {
		type: CREATE_APP.CREATE_APP_FAIL,
		error,
	};
}

// @flow
import {
 USER, APPS, DELETE_APP, CREATE_APP,
} from '../constants';
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

export function appendApp(app: Object): Object {
	return createAction(APPS.APPEND, app, null, null);
}

export function setAppsMetrics(metrics: Object): Object {
	return createAction(APPS.LOAD_METRICS_SUCCESS, metrics, null, null);
}

export function setAppsMetricsError(error: Object): Object {
	return createAction(APPS.LOAD_METRICS_FAIL, null, error, null);
}

export function getAppsOwners(): Object {
	return createAction(APPS.LOAD_OWNERS, null, null, null);
}

export function setAppsOwners(owners: Object): Object {
	return createAction(APPS.LOAD_OWNERS_SUCCESS, owners, null, null);
}

export function setAppsOwnersError(error: Object): Object {
	return createAction(APPS.LOAD_OWNERS_FAIL, null, error, null);
}

export function createApp(options: Object): Object {
	return createAction(CREATE_APP.LOAD, options, null, null);
}

export function setCreateApp(data: Object): Object {
	return createAction(CREATE_APP.LOAD_SUCCESS, data, null, null);
}

export function resetCreatedApp(): Object {
	return createAction(CREATE_APP.RESET, null, null, null);
}

export function createAppFail(error: Object): Object {
	const e = JSON.parse(error.message);
	return createAction(CREATE_APP.LOAD_FAIL, null, e, null);
}

export function removeAppMetrics(app: String): Object {
	return createAction(APPS.REMOVE_APP_METRICS, app, null, null);
}

export function removeAppData(options: Object): Object {
	return createAction(DELETE_APP.LOAD, options, null, null);
}

export function removeAppFromList(app: String): Object {
	return createAction(APPS.REMOVE_APP, app, null, null);
}

export function removeAppOwner(app: String): Object {
	return createAction(APPS.REMOVE_APP_OWNER, app, null, null);
}

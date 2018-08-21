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

export function loadApps(apps: Array<Object>): Object {
	return {
		type: APPS.LOAD,
		apps,
	};
}

export function setApps(apps: Array<Object>): Object {
	return {
		type: APPS.LOAD_SUCCESS,
		apps,
	};
}

export function setAppsError(error: Object): Object {
	return {
		type: APPS.LOAD_FAIL,
		error,
	};
}

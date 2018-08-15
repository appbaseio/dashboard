// @flow
import { USER } from '../constants';

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

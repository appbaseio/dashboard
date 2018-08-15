// @flow
import { USER } from '../constants';

export default function userReducer(state: ?Object = null, action: Object): ?Object {
	if (action.type === USER.LOAD_SUCCESS) {
		return action.user;
	}
	if (action.type === USER.LOAD_FAIL) {
		return null;
	}

	return state;
}

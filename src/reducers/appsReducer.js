// @flow
import { APPS } from '../constants';

export default function appsReducer(state: Object = {}, action: Object): ?Object {
	switch (action.type) {
		case APPS.LOAD: {
			return action.payload;
		}
		default:
			return state;
	}
}

// @flow
import { APPS } from '../constants';

export default function appsReducer(state: Object = {}, action: Object): ?Object {
	switch (action.type) {
		case APPS.LOAD: {
			return action.payload;
		}
		case APPS.APPEND: {
			return { ...state, ...action.payload };
		}
		case APPS.REMOVE_APP: {
			const apps = state;
			delete apps[action.payload];
			return apps;
		}
		default:
			return state;
	}
}

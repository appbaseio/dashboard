// @flow
import { CREATE_APP } from '../constants';

export default function userReducer(
	state: Object = {
		isLoading: false,
		data: null,
		error: null,
	},
	action: Object,
): ?Object {
	switch (action.type) {
		case CREATE_APP.LOAD: {
			return {
				data: null,
				isLoading: true,
			};
		}
		case CREATE_APP.CREATE_APP_SUCCESS: {
			return {
				isLoading: false,
				data: action.data,
				error: null,
			};
		}
		case CREATE_APP.CREATE_APP_FAIL: {
			return {
				isLoading: false,
				data: null,
				error: action.error,
			};
		}
		default:
			return state;
	}
}

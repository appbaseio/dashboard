// @flow
import { USER } from '../constants';

export default function userReducer(
	state: Object = {
		isLoading: true,
		data: null,
		error: null,
	},
	action: Object,
): ?Object {
	switch (action.type) {
		case USER.LOAD: {
			return {
				isLoading: true,
				data: null,
				error: null,
			};
		}
		case USER.LOAD_SUCCESS: {
			return {
				isLoading: false,
				data: action.payload,
				error: null,
			};
		}
		case USER.LOAD_FAIL: {
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

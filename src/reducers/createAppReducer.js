// @flow
import { CREATE_APP } from '../constants';

export default function createAppReducer(
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
		case CREATE_APP.LOAD_SUCCESS: {
			return {
				isLoading: false,
				data: action.payload,
				error: null,
			};
		}
		case CREATE_APP.LOAD_FAIL: {
			return {
				isLoading: false,
				data: null,
				error: action.error,
			};
		}
		case CREATE_APP.RESET: {
			return {
				isLoading: false,
				data: null,
				error: null,
			};
		}
		default:
			return state;
	}
}

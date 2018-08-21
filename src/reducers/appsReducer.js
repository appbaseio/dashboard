// @flow
import { APPS } from '../constants';

export default function appsReducer(
	state: Object = {
		isLoading: true,
		data: null,
		error: null,
	},
	action: Object,
): ?Object {
	switch (action.type) {
		case APPS.LOAD: {
			const data = {};

			if (action.apps) {
				Object.keys(action.apps).forEach((item) => {
					data[item] = {
						id: action.apps[item],
					};
				});
			}

			return {
				isLoading: true,
				data,
				error: null,
			};
		}
		case APPS.LOAD_SUCCESS:
		case APPS.LOAD_FAIL:
		default:
			return state;
	}
}

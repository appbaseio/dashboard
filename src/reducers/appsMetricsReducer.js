// @flow
import { APPS } from '../constants';

export default function appsMetricsReducer(
	state: Object = {
		isLoading: true,
		data: null,
		error: null,
	},
	action: Object,
): ?Object {
	switch (action.type) {
		case APPS.LOAD: {
			return {
				isLoading: true,
				data: null,
				error: null,
			};
		}
		case APPS.LOAD_METRICS_SUCCESS: {
			return {
				isLoading: false,
				data: action.payload,
				error: null,
			};
		}
		case APPS.LOAD_METRICS_FAIL: {
			return {
				isLoading: false,
				data: null,
				error: action.error,
			};
		}
		case APPS.APPEND: {
			const { data: allAppMetrics } = state;
			const appName = Object.keys(action.payload)[0];
			const timestamp = new Date().toISOString();
			return {
				isLoading: false,
				data: {
					...allAppMetrics,
					[appName]: {
						records: 0,
						api_calls: 0,
						timestamp,
					},
				},
				error: null,
			};
		}
		case APPS.DELETE_APP: {
			const { data: allAppMetrics } = state;
			delete allAppMetrics[action.payload];
			return {
				isLoading: false,
				data: allAppMetrics,
				error: null,
			};
		}
		default:
			return state;
	}
}

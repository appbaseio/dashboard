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
		case APPS.REMOVE_APP_METRICS: {
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

// @flow
import { APPS } from '../constants';

export default function appsOverviewReducer(
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
		case APPS.LOAD_OVERVIEW_SUCCESS: {
			return {
				isLoading: false,
				data: action.payload,
				error: null,
			};
		}
		case APPS.LOAD_OVERVIEW_FAIL: {
			return {
				isLoading: false,
				data: null,
				error: action.error,
			};
		}
		case APPS.APPEND: {
			const { data: allAppsOverview } = state;
			const appName = Object.keys(action.payload)[0];
			const timestamp = new Date().toISOString();
			return {
				isLoading: false,
				data: {
					...allAppsOverview,
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
			const { data: allAppsOverview } = state;
			delete allAppsOverview[action.payload];
			return {
				isLoading: false,
				data: allAppsOverview,
				error: null,
			};
		}
		default:
			return state;
	}
}

// @flow
import { APPS } from '../constants';

export default function appsOwnersReducer(
	state: Object = {
		isFetching: false,
		data: null,
		error: null,
	},
	action: Object,
): ?Object {
	switch (action.type) {
		case APPS.LOAD_OWNERS: {
			return {
				isFetching: true,
				data: null,
				error: null,
			};
		}
		case APPS.LOAD_OWNERS_SUCCESS: {
			let data = {};
			action.payload.forEach((item) => {
				data = {
					...data,
					[item.appname]: item.owner,
				};
			});
			return {
				isFetching: false,
				data,
				error: null,
			};
		}
		case APPS.LOAD_OWNERS_FAIL: {
			return {
				isFetching: false,
				data: null,
				error: action.error,
			};
		}
		case APPS.DELETE_APP: {
			const appOwners = state.data;
			delete appOwners[action.payload];
			return {
				isFetching: false,
				data: appOwners,
				error: null,
			};
		}
		default:
			return state;
	}
}

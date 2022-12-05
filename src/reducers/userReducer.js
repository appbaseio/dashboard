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
			const {
				picture: userPicture,
				avatar_url,
				...rest
			} = action.payload;
			const picture = userPicture || avatar_url;
			return {
				isLoading: false,
				data: { picture, ...rest },
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
		case USER.RESET: {
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

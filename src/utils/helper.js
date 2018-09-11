import { notification } from 'antd';
import get from 'lodash/get';

export const keySummary = {
	admin: 'Admin credentials',
	read: 'Read credentials',
	write: 'Write credentials',
};

export const displayErrors = (nextErrors = [], prevErrors = []) => {
	nextErrors.map((error, index) => {
		if (error && error !== prevErrors[index]) {
			notification.error({
				message: 'Error',
				description: get(error, 'responseJSON.message', 'Something went wrong'),
			});
		}
		return null;
	});
};

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

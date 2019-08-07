import { notification } from 'antd';
import get from 'lodash/get';
import { init, captureMessage } from '@sentry/browser';

const URLSearchParams = require('url-search-params');

init({
	dsn: 'https://8e07fb23ba8f46d8a730e65496bb7f00@sentry.io/58038',
});

export const keySummary = {
	admin: 'Admin credentials',
	read: 'Read credentials',
	write: 'Write credentials',
};

export const displayErrors = (nextErrors = [], prevErrors = [], showError = false) => {
	nextErrors.map((error, index) => {
		if (error && error !== prevErrors[index]) {
			if (!showError && process.env.NODE_ENV === 'production') {
				captureMessage(error.message);
			} else {
				notification.error({
					message: 'Error',
					description: error.message,
				});
			}
		}
		return null;
	});
};

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizePlan = (string = '') => {
	const splitString = string.split('-');
	if (splitString[1]) {
		return `${capitalizeFirstLetter(splitString[0])}`;
	}
	return capitalizeFirstLetter(string);
};

export const compressNumber = (amount) => {
	let mAmount = amount;
	let finalNum = null;
	try {
		let unit = '';
		if (amount >= 1000000) {
			unit = 'M';
		} else if (amount > 1000) {
			unit = 'K';
		}
		if (unit === 'M') {
			mAmount = parseFloat(amount / 1000000);
			mAmount = mAmount.toFixed(0);
		} else if (unit === 'K') {
			mAmount = parseFloat(amount / 1000);
			mAmount = mAmount.toFixed(0);
		} else {
			mAmount = amount;
		}
		finalNum = mAmount + unit;
	} catch (e) {
		console.log(e);
	}
	return finalNum;
};

export const planLimits = {
	free: {
		action: 100000,
		records: 10000,
	},
	bootstrap: {
		action: 1000000,
		records: 50000,
	},
	'bootstrap-monthly': {
		action: 1000000,
		records: 50000,
	},
	'bootstrap-annual': {
		action: 1000000,
		records: 50000,
	},
	growth: {
		action: 10000000,
		records: 1000000,
	},
	'growth-monthly': {
		action: 10000000,
		records: 1000000,
	},
	'growth-annual': {
		action: 10000000,
		records: 1000000,
	},
	'startup-monthly': {
		action: 1000000,
		records: 100000,
	},
	'business-monthly': {
		action: 10000000,
		records: 1000000,
	},
};

export const planBasePrice = {
	bootstrap: 29,
	growth: 89,
};

const calcPercentage = (appStats, plan = 'free', field) => {
	let count;
	if (field === 'action') {
		count = get(appStats, 'calls', 0);
	} else {
		count = get(appStats, 'records', 0);
	}

	const limit = planLimits[plan] || planLimits.free;
	let percentage = (100 * count) / limit[field];
	percentage = percentage < 100 ? percentage : 100;
	return {
		percentage,
		count,
	};
};
export const getAppCount = (appStats, plan) => {
	let obj = {
		action: {
			percentage: 0,
			count: 0,
		},
		records: {
			percentage: 0,
			count: 0,
		},
	};
	obj = {
		action: calcPercentage(appStats, plan, 'action'),
		records: calcPercentage(appStats, plan, 'records'),
	};
	return obj;
};

export const validateAppName = (name) => {
	const symbolsToCheck = /[\s#&*'"\\|,<>\/?]/; //eslint-disable-line
	const nameCharacters = name.split('');
	const startsWith =		nameCharacters[0] === '+' || nameCharacters[0] === '-' || nameCharacters[0] === '_';

	if (name === '.' || name === '..' || name === '' || symbolsToCheck.test(name) || startsWith) {
		return false;
	}
	return true;
};

export const validationsList = [
	'Lowercase only',
	'Cannot include \\, /, *, ?, ", <, >, |, ` ` (space character), ,, #',
	'Cannot start with -, _, +',
	'Cannot be . or ..',
];

export function getUrlParams(url) {
	if (!url) {
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
}

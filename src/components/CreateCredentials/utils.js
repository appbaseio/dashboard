export const Suggestions = {
	1: {
		prefix: '',
		suffix: '',
		description: 'Matches exactly',
	},
	2: {
		prefix: '',
		suffix: '*',
		description: 'Matches referers starting with',
	},
	3: {
		prefix: '*',
		suffix: '',
		description: 'Matches referers ending with',
	},
	4: {
		prefix: '*',
		suffix: '*',
		description: 'Matches referers containing',
	},
};
export const getSuggestionCode = (str) => {
	if (str === '*') {
		return 'Matches All';
	}
	if (str.startsWith('*') && str.endsWith('*')) {
		return Suggestions[4].description;
	}
	if (str.startsWith('*')) {
		return Suggestions[3].description;
	}
	if (str.endsWith('*')) {
		return Suggestions[2].description;
	}
	return Suggestions[1].description;
};
export const ipValidator = (value) => {
	const splitIp = value && value.split('/');
	if (
		splitIp
		&& /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
			splitIp[0],
		)
	) {
		const parsedNumber = parseInt(splitIp[1], 10);
		if (parsedNumber > -1 && parsedNumber < 33) {
			return true;
		}
		return false;
	}
	return false;
};
export const isNegative = (control) => {
	if (control.value && parseInt(control.value, 10) < 0) {
		return { isNegative: true };
	}
	return undefined;
};
// Operation types
export const Types = {
	read: {
		description: 'Read-only key',
		read: true,
		write: false,
	},
	write: {
		description: 'Write-only key',
		read: false,
		write: true,
	},
	admin: {
		description: 'Admin key',
		read: true,
		write: true,
	},
};
// Acl options
export const aclOptions = ['index', 'get', 'search', 'settings', 'stream', 'bulk', 'delete'];
// Default Selected Acl
export const defaultAclOptions = ['index', 'get', 'search', 'settings', 'stream', 'bulk', 'delete'];
/**
 * To get acl options according to the users plan
 * @param {string} plan
 */
export const getAclOptionsByPlan = (plan) => {
	if (plan === 'growth') {
		return [...aclOptions, 'analytics'];
	}
	return aclOptions;
};
/**
 * To get default selected acl options according to the users plan
 * @param {string} plan
 */
export const getDefaultAclOptionsByPlan = (plan) => {
	if (plan === 'growth') {
		return [...defaultAclOptions, 'analytics'];
	}
	return defaultAclOptions;
};
// Acl options label
export const aclOptionsLabel = {
	index: 'Index',
	get: 'Get',
	search: 'Search',
	settings: 'Settings',
	stream: 'Stream',
	bulk: 'Bulk',
	delete: 'Delete',
	analytics: 'Analytics',
};

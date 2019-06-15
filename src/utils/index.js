import { ACC_API } from '../constants/config';

export async function getUser() {
	const response = await fetch(`${ACC_API}/user`, { credentials: 'include' });
	const data = await response.json();
	if (response.status === 404) {
		window.location.href = `${ACC_API}/logout?next=https://dashboard.appbase.io/login`;
		throw new Error(data);
	}

	const user = {
		...data.body,
		...data.body.details,
	};

	const _hsq = window._hsq || [];
	_hsq.push([
		'identify',
		{
			email: user.email,
		},
	]);

	window.Intercom('boot', {
		app_id: 'f9514ssx',
		custom_launcher_selector: '#intercom',
		email: user.email,
		name: user.name,
	});

	const { apps } = data.body;
	return { user, apps };
}

export async function getAppsMetrics() {
	const response = await fetch(`${ACC_API}/user/apps/metrics`, { credentials: 'include' });
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.body;
}

export async function getAppsOwners() {
	const response = await fetch(`${ACC_API}/user/apps`, { credentials: 'include' });
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.body;
}

export async function getAppsOverview() {
	const response = await fetch(`${ACC_API}/user/apps/overview`, {
		credentials: 'include',
	});
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.body;
}

export async function getCreateApp(options) {
	const response = await fetch(`${ACC_API}/app/${options.appName}`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			category: options.category,
			es_version: options.es_version,
		}),
	});
	let data;
	try {
		data = await response.json();
	} catch (error) {
		data = {
			message: 'Something went Wrong!',
		};
	}

	if (response.status >= 400) {
		throw new Error(JSON.stringify(data));
	}

	const { body, message } = data;
	return { ...body, message };
}

// returns the required param from the url
export function getParam(name, url) {
	/* eslint-disable */
	if (!url) url = window.location.href;
	const param = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	const regexS = '[\\?&]' + param + '=([^&#]*)';
	const regex = new RegExp(regexS);
	const results = regex.exec(url);
	return results == null ? null : results[1];
}

export async function deleteApp(appName) {
	const response = await fetch(`${ACC_API}/app/${appName}`, {
		credentials: 'include',
		method: 'DELETE',
	});
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.message;
}

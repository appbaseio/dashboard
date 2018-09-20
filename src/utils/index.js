import { ACC_API } from '../constants/config';

export async function getUser() {
	const response = await fetch(`${ACC_API}/user`, { credentials: 'include' });
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	const user = {
		...data.body,
		...data.body.details,
	};

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

	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(JSON.stringify(data));
	}

	const { body, message } = data;
	return { ...body, message };
}

export async function deleteApp(appId) {
	const response = await fetch(`${ACC_API}/app/${appId}`, {
		credentials: 'include',
		method: 'DELETE',
	});
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.message;
}

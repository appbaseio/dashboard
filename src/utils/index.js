import { ACC_API } from '../constants/config';

export async function createUserIfNew(idToken) {
	const response = await fetch(`${ACC_API}/user/signup-if-new-user`, {
		body: JSON.stringify({
			idToken,
		}),
		method: 'POST',
	});

	if (response.status === 200) {
		return response;
	}
	// console.log(response); // Debug log
	return response;
}
export async function getUser() {
	const response = await fetch(`${ACC_API}/user`, { credentials: 'include' });
	const data = await response.json();
	if (response.status === 404) {
		window.location.href = `${ACC_API}/logout?next=https://dashboard.appbase.io/login`;
		throw new Error(data);
	}
	if (
		(response.status === 401 || response.status === 403) &&
		data.action?.email_verification
	) {
		return data;
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
	const metrics = null;
	// try {
	// 	const metricsResponse = await fetch(`${ACC_API}/user/metrics`, {
	// 		credentials: 'include',
	// 	});
	// 	if (metricsResponse.status >= 400) {
	// 		throw new Error();
	// 	}
	// 	metrics = await metricsResponse.json();
	// } catch (e) {
	// 	console.error('Unable to fetch Metrics');
	// }

	if (window.Tawk_API) {
		// Set visitor attributes for Tawk.to
		window.Tawk_API.visitor = {
			name: user.name || 'Unknown',
			email: user.email || '',
		};

		// Set additional attributes
		window.Tawk_API.setAttributes(
			{
				Company: user.company || '',
				'Use Case': user.usecase || '',
				'Deployment Timeframe': user['deployment-timeframe'] || '',
				Phone: user.phone || '',
				'Total Apps': user.apps ? Object.keys(user.apps).length : 0,
				Context: 'appbase.io',
				'API Calls':
					(metrics &&
						metrics.body &&
						metrics.body.month &&
						metrics.body.month.apiCalls) ||
					0,
				Storage:
					(metrics &&
						metrics.body &&
						metrics.body.overall &&
						metrics.body.overall.storage / 1048576) ||
					0,
			},
			function errorHandler() {
				// Handle error if needed
			},
		);
	}

	const { apps } = data.body;
	return { user, apps };
}

export async function getAppsMetrics() {
	const response = await fetch(`${ACC_API}/user/apps/metrics`, {
		credentials: 'include',
	});
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	return data.body;
}

export async function getAppsOwners() {
	const response = await fetch(`${ACC_API}/user/apps`, {
		credentials: 'include',
	});
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
	if (data.body) {
		if (window.Tawk_API && window.Tawk_API.setAttributes) {
			window.Tawk_API.setAttributes({
				'Apps Overview': 'Updated',
			});
		}
	}
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

export const setRole = (appId, username, role) =>
	new Promise((resolve, reject) => {
		fetch(`${ACC_API}/app/${appId}/permission/${username}/role/${role}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		})
			.then(res => res.json())
			.then(data => resolve({ ...data.body, message: data.message }))
			.catch(error => reject(error));
	});

export const deleteRole = (appId, username) =>
	new Promise((resolve, reject) => {
		fetch(`${ACC_API}/app/${appId}/permission/${username}/role`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		})
			.then(res => res.json())
			.then(data => resolve({ ...data.body, message: data.message }))
			.catch(error => reject(error));
	});

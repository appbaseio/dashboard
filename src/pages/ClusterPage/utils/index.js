import { ACC_API } from '../../../constants/config';

export function getClusters() {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/clusters`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then((data) => {
				resolve(data.clusters);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function getClusterInvoice(id) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/subscription/cluster/${id}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function getSnapshots(cluster, restoreFrom) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/snapshots/${cluster}/repository/${restoreFrom}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then((data) => {
				resolve(data.snapshots);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function restore(cluster, restoreFrom, snapshot_id) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/restore/${cluster}/repository/${restoreFrom}`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				snapshot_id,
				indices: '-.*',
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function getClusterData(id) {
	return new Promise((resolve, reject) => {
		let hasError = false;
		fetch(`${ACC_API}/v1/_status/${id}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				if (res.status > 300) {
					hasError = true;
				}
				return res.json();
			})
			.then((data) => {
				if (hasError) {
					const { status, ...others } = data;
					reject(JSON.stringify({ message: status.message, ...others }));
				}
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function deployCluster(cluster, id) {
	const body = JSON.stringify(cluster);
	return new Promise((resolve, reject) => {
		let hasError = false;
		fetch(`${ACC_API}/v1/_deploy${id ? `/${id}` : ''}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		})
			.then((res) => {
				if (res.status > 300) {
					hasError = true;
				}
				return res.json();
			})
			.then((data) => {
				if (hasError) {
					reject(data.status.message);
				}
				if (data.error) {
					reject(data.error);
				}
				if (data.body && data.body.response_info.failures.length) {
					reject(data.body.response_info.failures);
				}
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function deleteCluster(id) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		})
			.then(res => res.json())
			.then((data) => {
				if (data.error) {
					reject(data.error);
				}
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function createSubscription(id, token) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/subscription/cluster/${id}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token,
			}),
		})
			.then(resolve)
			.catch(reject);
	});
}

export function scaleCluster(id, nodes) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_scale/${id}/elasticsearch/nodecount`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				node_count: nodes,
			}),
		})
			.then(res => res.json())
			.then((res) => {
				if (res.status.code >= 400) {
					reject(res.status.message);
				} else {
					resolve(res.status.message);
				}
			})
			.catch(reject);
	});
}

export function getSharedUsers(id) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_share/${id}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.json())
			.then((res) => {
				if (res.status.code >= 400) {
					reject(res.status.message);
				} else {
					resolve(res.users);
				}
			})
			.catch(reject);
	});
}

export function addSharedUser(id, email, role) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_share/${id}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				role,
			}),
		})
			.then(res => res.json())
			.then((res) => {
				if (res.status.code >= 400) {
					reject(res.status.message);
				} else {
					resolve(res.status.message);
				}
			})
			.catch(reject);
	});
}

export function deleteSharedUser(id, email) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_share/${id}/${email}`, {
			method: 'DELETE',
			credentials: 'include',
		})
			.then(res => res.json())
			.then((res) => {
				if (res.status.code >= 400) {
					reject(res.status.message);
				} else {
					resolve(res.status.message);
				}
			})
			.catch(reject);
	});
}

export function deployMyCluster(body) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_deploy_recipe/arc`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...body,
			}),
		})
			.then(res => res.json())
			.then((data) => {
				if (data.error) {
					reject(data.error);
				}
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function verifyCluster(url) {
	const { origin, username, password } = new URL(url);
	let headers = {};

	if (username && password) {
		headers = {
			Authorization: `Basic ${btoa(`${username}:${password}`)}`,
		};
	}
	return new Promise((resolve, reject) => {
		fetch(origin, {
			method: 'GET',
			headers,
		})
			.then(res => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function updateArcDetails(id, body) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_deploy_recipe/arc/${id}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...body,
			}),
		})
			.then(res => res.json())
			.then((data) => {
				if (data.error) {
					reject(data.error);
				}
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export const hasAddon = (item, source) => !!(source.addons || []).find(key => key.name === item);
export const getAddon = (item, source) => (source.addons || []).find(key => key.name === item);

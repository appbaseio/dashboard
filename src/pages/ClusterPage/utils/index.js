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

export function getClusterData(id) {
	return new Promise((resolve, reject) => {
		let hasError = false;
		const hasPaymentError = false;
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
					reject(data.status.message);
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
		fetch(`${ACC_API}/subscription/cluster/${id}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token,
				plan: 'sandbox',
			}),
		})
			.then(resolve)
			.catch(reject);
	});
}

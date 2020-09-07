import get from 'lodash/get';
import { ACC_API } from '../../../constants/config';

export const CLUSTER_PLANS = {
	SANDBOX_2019: '2019-sandbox',
	HOBBY_2019: '2019-hobby',
	STARTER_2019: '2019-starter',
	SANDBOX_2020: '2020-sandbox',
	HOBBY_2020: '2020-hobby',
	STARTER_2020: '2020-starter',
	PRODUCTION_2019_1: '2019-production-1',
	PRODUCTION_2019_2: '2019-production-2',
	PRODUCTION_2019_3: '2019-production-3',
};

export const ARC_PLANS = {
	ARC_BASIC: 'arc-basic',
	ARC_STANDARD: 'arc-standard',
	ARC_ENTERPRISE: 'arc-enterprise',
	HOSTED_ARC_BASIC: 'hosted-arc-basic',
	HOSTED_ARC_BASIC_V2: 'hosted-arc-basic-v2',
	HOSTED_ARC_STANDARD: 'hosted-arc-standard',
	HOSTED_ARC_ENTERPRISE: 'hosted-arc-enterprise',
};

export const EFFECTIVE_PRICE_BY_PLANS = {
	[ARC_PLANS.ARC_BASIC]: 0.03,
	[ARC_PLANS.ARC_STANDARD]: 0.08,
	[ARC_PLANS.ARC_ENTERPRISE]: 0.69,
	[ARC_PLANS.HOSTED_ARC_BASIC]: 0.05,
	[ARC_PLANS.HOSTED_ARC_BASIC_V2]: 0.04,
	[ARC_PLANS.HOSTED_ARC_STANDARD]: 0.12,
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE]: 0.83,
	[CLUSTER_PLANS.SANDBOX_2019]: 0.08,
	[CLUSTER_PLANS.HOBBY_2019]: 0.17,
	[CLUSTER_PLANS.STARTER_2019]: 0.28,
	[CLUSTER_PLANS.SANDBOX_2020]: 0.07,
	[CLUSTER_PLANS.HOBBY_2020]: 0.14,
	[CLUSTER_PLANS.STARTER_2020]: 0.21,
	[CLUSTER_PLANS.PRODUCTION_2019_1]: 1.11,
	[CLUSTER_PLANS.PRODUCTION_2019_2]: 2.22,
	[CLUSTER_PLANS.PRODUCTION_2019_3]: 4.44,
};

export const PRICE_BY_PLANS = {
	[ARC_PLANS.ARC_BASIC]: 19,
	[ARC_PLANS.ARC_STANDARD]: 59,
	[ARC_PLANS.ARC_ENTERPRISE]: 499,
	[ARC_PLANS.HOSTED_ARC_BASIC]: 39,
	[ARC_PLANS.HOSTED_ARC_BASIC_V2]: 29,
	[ARC_PLANS.HOSTED_ARC_STANDARD]: 89,
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE]: 599,
	[CLUSTER_PLANS.SANDBOX_2019]: 59,
	[CLUSTER_PLANS.HOBBY_2019]: 119,
	[CLUSTER_PLANS.STARTER_2019]: 199,
	[CLUSTER_PLANS.SANDBOX_2020]: 49,
	[CLUSTER_PLANS.HOBBY_2020]: 99,
	[CLUSTER_PLANS.STARTER_2020]: 149,
	[CLUSTER_PLANS.PRODUCTION_2019_1]: 799,
	[CLUSTER_PLANS.PRODUCTION_2019_2]: 1599,
	[CLUSTER_PLANS.PRODUCTION_2019_3]: 3199,
};

export const PLAN_LABEL = {
	[ARC_PLANS.HOSTED_ARC_BASIC_V2]: 'Basic',
	[ARC_PLANS.HOSTED_ARC_STANDARD]: 'Standard',
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE]: 'Enterprise',
	[CLUSTER_PLANS.SANDBOX_2019]: 'Sandbox',
	[CLUSTER_PLANS.HOBBY_2019]: 'Hobby',
	[CLUSTER_PLANS.STARTER_2019]: 'Starter',
	[CLUSTER_PLANS.SANDBOX_2020]: 'Sandbox',
	[CLUSTER_PLANS.HOBBY_2020]: 'Hobby',
	[CLUSTER_PLANS.STARTER_2020]: 'Starter',
	[CLUSTER_PLANS.PRODUCTION_2019_1]: 'Production 1',
	[CLUSTER_PLANS.PRODUCTION_2019_2]: 'Production 2',
	[CLUSTER_PLANS.PRODUCTION_2019_3]: 'Production 3',
};

export function hasAnsibleSetup(pricingPlan) {
	const plans = [
		CLUSTER_PLANS.SANDBOX_2020,
		CLUSTER_PLANS.HOBBY_2020,
		CLUSTER_PLANS.STARTER_2020,
		CLUSTER_PLANS.PRODUCTION_2019_1,
		CLUSTER_PLANS.PRODUCTION_2019_2,
		CLUSTER_PLANS.PRODUCTION_2019_3,
		ARC_PLANS.HOSTED_ARC_BASIC,
		ARC_PLANS.HOSTED_ARC_BASIC_V2,
		ARC_PLANS.HOSTED_ARC_STANDARD,
		ARC_PLANS.HOSTED_ARC_ENTERPRISE,
	];

	return plans.some(i => i === pricingPlan);
}

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
			.then(data => {
				resolve(data.clusters);
			})
			.catch(e => {
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
			.then(data => {
				resolve(data);
			})
			.catch(e => {
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
			.then(data => {
				resolve(data.snapshots);
			})
			.catch(e => {
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
			.then(data => {
				resolve(data);
			})
			.catch(e => {
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
			.then(res => {
				if (res.status > 300) {
					hasError = true;
				}
				return res.json();
			})
			.then(data => {
				if (hasError) {
					const { status, ...others } = data;
					reject(
						JSON.stringify({ message: status.message, ...others }),
					);
				}
				resolve(data);
			})
			.catch(e => {
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
			.then(res => {
				if (res.status > 300) {
					hasError = true;
				}
				return res.json();
			})
			.then(data => {
				if (hasError) {
					reject(data.status.message);
				}
				if (data.error) {
					reject(data.error);
				}
				if (data.body && data.body.response_info.failures.length) {
					reject(data.body.response_info.failures);
				}
				resolve(data);
			})
			.catch(e => {
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
			.then(data => {
				if (data.error) {
					reject(data.error);
				}
				resolve();
			})
			.catch(e => {
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
			.then(res => {
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
			.then(res => {
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
			.then(res => {
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
			.then(res => {
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
		let hasError = false;
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
			.then(res => {
				if (res.status > 300) {
					hasError = true;
				}
				return res.json();
			})
			.then(data => {
				if (hasError) {
					reject(get(data, 'status.message'));
				}
				if (data.error) {
					reject(data.error);
				}
				resolve(data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function verifyCluster(url) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_verify_es_connection`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elasticsearch_url: url,
			}),
		})
			.then(res => res.json())
			.then(data => {
				if (
					data.version &&
					parseInt(data.version.number.split('.')[0], 10) < 6
				) {
					reject(
						new Error(
							'Appbase.io is only supported for ElasticSearch version >= 6',
						),
					);
				} else if (data.error) {
					reject(new Error(`${data.error.reason}`));
				} else {
					resolve(data);
				}
			})
			.catch(e => {
				if (e.error && e.error.message) {
					reject(e.error.message);
				} else {
					reject(
						new Error(
							'Connection Failed. Make sure the details you entered are correct.',
						),
					);
				}
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
			.then(data => {
				if (data.error) {
					reject(data.error);
				}
				resolve();
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getArcVersion(arcURL, arcUsername, arcPassword) {
	try {
		const res = await fetch(`${arcURL}arc/plan`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: btoa(`${arcUsername}:${arcPassword}`),
			},
		});
		const json = await res.json();
		return json;
	} catch (err) {
		console.error(err);
		return {};
	}
}

export const hasAddon = (item, source) =>
	!!(source.addons || []).find(key => key.name === item);
export const getAddon = (item, source) =>
	(source.addons || []).find(key => key.name === item);

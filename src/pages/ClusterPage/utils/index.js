import get from 'lodash/get';
import { v4 as uuidv4 } from 'uuid';
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
	STARTER_2021: '2021-starter',
	PRODUCTION_2021_1: '2021-production-1',
	PRODUCTION_2021_2: '2021-production-2',
	PRODUCTION_2021_3: '2021-production-3',
};

export const ARC_PLANS = {
	ARC_BASIC: 'arc-basic',
	ARC_STANDARD: 'arc-standard',
	ARC_ENTERPRISE: 'arc-enterprise',
	HOSTED_ARC_BASIC: 'hosted-arc-basic',
	HOSTED_ARC_BASIC_V2: 'hosted-arc-basic-v2',
	HOSTED_ARC_STANDARD: 'hosted-arc-standard',
	HOSTED_ARC_ENTERPRISE: 'hosted-arc-enterprise',
	HOSTED_ARC_STANDARD_2021: '2021-hosted-arc-standard',
	HOSTED_ARC_ENTERPRISE_2021: '2021-hosted-arc-enterprise',
};

export const isSandBoxPlan = plan =>
	plan === CLUSTER_PLANS.SANDBOX_2019 ||
	plan === CLUSTER_PLANS.SANDBOX_2020 ||
	plan === ARC_PLANS.ARC_BASIC ||
	plan === ARC_PLANS.HOSTED_ARC_BASIC ||
	plan === ARC_PLANS.HOSTED_ARC_BASIC_V2;

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
	[CLUSTER_PLANS.STARTER_2021]: 0.414,
	[CLUSTER_PLANS.PRODUCTION_2021_1]: 1.389,
	[CLUSTER_PLANS.PRODUCTION_2021_2]: 2.775,
	[CLUSTER_PLANS.PRODUCTION_2021_3]: 4.44,
	[ARC_PLANS.HOSTED_ARC_STANDARD_2021]: 0.137,
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021]: 1.11,
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
	[CLUSTER_PLANS.STARTER_2021]: 299,
	[CLUSTER_PLANS.PRODUCTION_2021_1]: 999,
	[CLUSTER_PLANS.PRODUCTION_2021_2]: 1999,
	[CLUSTER_PLANS.PRODUCTION_2021_3]: 3199,
	[ARC_PLANS.HOSTED_ARC_STANDARD_2021]: 99,
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021]: 799,
};

export const PLAN_LABEL = {
	[ARC_PLANS.HOSTED_ARC_BASIC]: 'Basic',
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
	[CLUSTER_PLANS.STARTER_2021]: 'Starter',
	[CLUSTER_PLANS.PRODUCTION_2021_1]: 'Production 1',
	[CLUSTER_PLANS.PRODUCTION_2021_2]: 'Production 2',
	[CLUSTER_PLANS.PRODUCTION_2021_3]: 'Production 3',
	[ARC_PLANS.HOSTED_ARC_STANDARD_2021]: 'Standard',
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021]: 'Enterprise',
};

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

export function getSnapshots(cluster) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_snapshots/${cluster}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then(data => {
				let snapshots = [...data.snapshots];
				snapshots = snapshots.sort(
					(a, b) => Number(b.id) - Number(a.id),
				);
				resolve(snapshots);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function restore(cluster, restoreFrom, snapshot_id, repository) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/_restore/${restoreFrom}/${cluster}`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				snapshot_id,
				indices: '-.*,-metricbeat-*,.ds-metricbeat-*',
				repository_name: repository,
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
						JSON.stringify({
							message: status.message,
							...others,
							status,
						}),
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

export function createSubscription({ clusterId, ...rest }) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v1/subscription/cluster/${clusterId}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(rest),
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

export async function verifyCluster(url) {
	try {
		const res = await fetch(`${ACC_API}/v1/_verify_es_connection`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				elasticsearch_url: url,
			}),
		});

		if (res.status >= 400 && res.status < 500) {
			const textData = await res.text();
			throw new Error(`${res.status}: ${textData}`);
		}

		if (res.status >= 500) {
			const jsonData = await res.json();
			throw new Error(`${res.status}: ${jsonData.message}`);
		}

		const data = await res.json();
		if (
			data.version &&
			parseInt(data.version.number.split('.')[0], 10) < 6
		) {
			throw new Error(
				'Appbase.io is only supported for ElasticSearch version >= 6',
			);
		} else if (data.error) {
			throw new Error(`${data.error.reason}`);
		}
		return data;
	} catch (err) {
		if (err.error && err.error.message) {
			throw err.error.message;
		} else {
			throw new Error(
				`Connection failed with error: ${err.message}\n Make sure the details you entered are correct.`,
			);
		}
	}
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

export function getCoupon(couponCode) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/coupon/${couponCode}`, {
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

export function getPaymentMethods() {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/user/payment_methods`, {
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

export const hasAddon = (item, source) =>
	!!(source.addons || []).find(key => key.name === item);
export const getAddon = (item, source) =>
	(source.addons || []).find(key => key.name === item);
const generateRandomUsername = length => {
	const chars =
		'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = length; i > 0; i -= 1)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

export const rotateAPICredentials = (type, clusterId) => {
	const username = generateRandomUsername(9);
	const password = uuidv4();
	let reqBody = {};
	switch (type) {
		case 'Elasticsearch':
			reqBody = {
				es_username: username,
				es_password: password,
			};
			break;
		case 'Appbase.io':
			reqBody = {
				arc_username: username,
				arc_password: password,
			};
			break;
		case 'kibana':
			reqBody = {
				kibana_username: username,
				kibana_password: password,
			};
			break;
		default:
			break;
	}
	return new Promise((resolve, reject) => {
		let hasError = false;
		fetch(`${ACC_API}/v1/_update_credentials/${clusterId}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...reqBody,
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
					reject(data.status.message);
				}
				if (data.error) {
					reject(data.error);
				}
				if (data.body && data.body.response_info.failures.length) {
					reject(data.body.response_info.failures);
				}
				resolve({ ...data, username, password });
			})
			.catch(e => {
				reject(e);
			});
	});
};

export function getDeployedCluster(clusterId) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v2/_deploy/${clusterId}/deploy_logs`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-ndjson',
			},
		})
			.then(async res => await res.text())
			.then(async res => {
				const convertedData = String(res)
					.replace(/\n/gi, ',')
					.slice(0, -1);

				const jsonData = await JSON.parse(`[${convertedData}]`);
				resolve(jsonData);
			})
			.catch(e => {
				console.error('Error: Failed to fetch deploy logs', e);
				reject(e);
			});
	});
}

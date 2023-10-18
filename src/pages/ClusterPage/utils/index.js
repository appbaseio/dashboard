/* eslint-disable import/no-mutable-exports */
import get from 'lodash/get';
import { v4 as uuidv4 } from 'uuid';
import { ACC_API } from '../../../constants/config';

export const BACKENDS = {
	System: {
		name: 'system',
		logo: '',
		text: 'System',
	},
	ELASTICSEARCH: {
		name: 'elasticsearch',
		logo: '/static/images/logos/elasticsearch.svg',
	},
	OPENSEARCH: {
		name: 'opensearch',
		logo: '/static/images/logos/opensearch.svg',
	},
	SOLR: {
		name: 'solr',
		logo: '/static/images/logos/fusion.png',
	},
	MONGODB: {
		name: 'mongodb',
		logo: '/static/images/logos/mongodb.svg',
	},
};

export const capitalizeWord = str => {
	if (!str || typeof str !== 'string') {
		return '';
	}

	return str.charAt(0).toUpperCase() + str.substring(1);
};
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
	//
	CLUSTER_SLS_HOBBY: 'reactivesearch-cloud-hobby',
	CLUSTER_SLS_PRODUCTION: 'reactivesearch-cloud-production',
	CLUSTER_SLS_ENTERPRISE: 'reactivesearch-cloud-enterprise',
	// AI plans
	SANDBOX_2023: '2023-sandbox',
	STARTER_2023: '2023-starter',
	PRODUCTION_2023_1: '2023-production-1',
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
	plan === CLUSTER_PLANS.SANDBOX_2023 ||
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
	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: 1.11,
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: 2.22,
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: 4.44,
	[CLUSTER_PLANS.SANDBOX_2023]: 0.1375,
	[CLUSTER_PLANS.STARTER_2023]: 0.185,
	[CLUSTER_PLANS.PRODUCTION_2023_1]: 0.55,
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
	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: 29,
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: 149,
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: 2500, // contact us
	[CLUSTER_PLANS.SANDBOX_2023]: 99,
	[CLUSTER_PLANS.STARTER_2023]: 399,
	[CLUSTER_PLANS.PRODUCTION_2023_1]: 1199,
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
	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: 'Hobby',
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: 'Production',
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: 'Enterprise',
	[CLUSTER_PLANS.SANDBOX_2023]: 'Sandbox',
	[CLUSTER_PLANS.STARTER_2023]: 'Starter',
	[CLUSTER_PLANS.PRODUCTION_2023_1]: 'Production',
};

export let elasticsearch_7x;
export let elasticsearch_8x;
export let opensearch;
export let sls;
export let arc;

fetch('https://accapi.appbase.io/v2/supported_versions')
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		({ elasticsearch_7x, elasticsearch_8x, opensearch, sls, arc } = data);
	})
	.catch(error => {
		console.log(
			'There was a problem with the fetch operation:',
			error.message,
		);
	});

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

export function deleteCluster(id, isSLSCluster = false) {
	return new Promise((resolve, reject) => {
		fetch(
			`${ACC_API}/${
				isSLSCluster ? 'v2/_delete_mtrs' : 'v1/_delete'
			}/${id}`,
			{
				method: 'DELETE',
				credentials: 'include',
			},
		)
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
		fetch(`${ACC_API}/v2/_deploy_recipe/reactivesearch`, {
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
export function deployMySlsCluster(body) {
	return new Promise((resolve, reject) => {
		let hasError = false;
		fetch(`${ACC_API}/v2/_deploy_recipe/multi-tenant-reactivesearch`, {
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

export async function verifyCluster(url, backend, headers = {}) {
	try {
		const res = await fetch(
			`${ACC_API}/v2/_verify_search_engine_connection`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				body: JSON.stringify({
					url,
					backend,
				}),
			},
		);

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
			backend === BACKENDS.ELASTICSEARCH.name &&
			data.version &&
			parseInt(data.version.number.split('.')[0], 10) < 6
		) {
			throw new Error(
				'Reactivesearch.io is only supported for ElasticSearch version >= 6',
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

export const rotateAPICredentials = (type, clusterId, isSLSCluster) => {
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
		case 'Reactivesearch.io':
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
		if (isSLSCluster) {
			fetch(`${ACC_API}/v2/_update_mtrs_credentials/${clusterId}`, {
				method: 'POST',
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
		} else {
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
		}
	});
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
	if (lat1 === lat2 && lon1 === lon2) {
		return 0;
	}
	const radlat1 = (Math.PI * lat1) / 180;
	const radlat2 = (Math.PI * lat2) / 180;
	const theta = lon1 - lon2;
	const radtheta = (Math.PI * theta) / 180;
	let dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515;

	return dist;
};

export function updateBackend(id, body) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/v2/_update_mtrs_backend_connection/${id}`, {
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

export const SSH_KEY =
	'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCVqOPpNuX53J+uIpP0KssFRZToMV2Zy/peG3wYHvWZkDvlxLFqGTikH8MQagt01Slmn+mNfHpg6dm5NiKfmMObm5LbcJ62Nk9AtHF3BPP42WyQ3QiGZCjJOX0fVsyv3w3eB+Eq+F+9aH/uajdI+wWRviYB+ljhprZbNZyockc6V33WLeY+EeRQW0Cp9xHGQUKwJa7Ch8/lRkNi9QE6n5W/T6nRuOvu2+ThhjiDFdu2suq3V4GMlEBBS6zByT9Ct5ryJgkVJh6d/pbocVWw99mYyVm9MNp2RD9w8R2qytRO8cWvTO/KvsAZPXj6nJtB9LaUtHDzxe9o4AVXxzeuMTzx siddharth@appbase.io';

export const esVersions = ['8.9.0', '7.17.10'];

export const openSearchVersions = ['2.9.0'];
export const ansibleMachineMarks = {
	[CLUSTER_PLANS.SANDBOX_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.SANDBOX_2020],
		plan: CLUSTER_PLANS.SANDBOX_2020,
		storage: 30,
		memory: 4,
		nodes: 1,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 30,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2020],
	},
	[CLUSTER_PLANS.HOBBY_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.HOBBY_2020],
		plan: CLUSTER_PLANS.HOBBY_2020,
		storage: 60,
		memory: 4,
		nodes: 2,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.HOBBY_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 30,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.HOBBY_2020],
	},
	[CLUSTER_PLANS.STARTER_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.STARTER_2020],
		plan: CLUSTER_PLANS.STARTER_2020,
		storage: 120,
		memory: 4,
		nodes: 3,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 40,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2020],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_1]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_1],
		plan: CLUSTER_PLANS.PRODUCTION_2019_1,
		storage: 480,
		memory: 16,
		nodes: 3,
		cpu: 4,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_1],
		gkeMachine: 'e2-standard-4',
		awsMachine: 't3.xlarge',
		storagePerNode: 160,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_1],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_2]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_2],
		plan: CLUSTER_PLANS.PRODUCTION_2019_2,
		storage: 999,
		memory: 32,
		nodes: 3,
		cpu: 8,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_2],
		gkeMachine: 'e2-standard-8',
		awsMachine: 't3.2xlarge',
		storagePerNode: 333,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_2],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_3]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_3],
		plan: CLUSTER_PLANS.PRODUCTION_2019_3,
		storage: 2997,
		memory: 64,
		nodes: 3,
		cpu: 16,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_3],
		gkeMachine: 'e2-standard-16',
		awsMachine: 'm5a.4xlarge',
		storagePerNode: 999,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_3],
	},
	[CLUSTER_PLANS.STARTER_2021]: {
		label: PLAN_LABEL[CLUSTER_PLANS.STARTER_2021],
		plan: CLUSTER_PLANS.STARTER_2021,
		storage: 240,
		memory: 8,
		nodes: 3,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2021],
		gkeMachine: 'e2-standard-2',
		awsMachine: 't3.large',
		storagePerNode: 80,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2021],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_1]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_1],
		plan: CLUSTER_PLANS.PRODUCTION_2021_1,
		storage: 480,
		memory: 16,
		nodes: 3,
		cpu: 4,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_1],
		gkeMachine: 'e2-standard-4',
		awsMachine: 't3.xlarge',
		storagePerNode: 160,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_1],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_2]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_2],
		plan: CLUSTER_PLANS.PRODUCTION_2021_2,
		storage: 999,
		memory: 32,
		nodes: 3,
		cpu: 8,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_2],
		gkeMachine: 'e2-standard-8',
		awsMachine: 't3.2xlarge',
		storagePerNode: 333,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_2],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_3]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_3],
		plan: CLUSTER_PLANS.PRODUCTION_2021_3,
		storage: 2997,
		memory: 64,
		nodes: 3,
		cpu: 16,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_3],
		gkeMachine: 'e2-standard-16',
		awsMachine: 'm5a.4xlarge',
		storagePerNode: 999,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_3],
	},

	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		plan: CLUSTER_PLANS.CLUSTER_SLS_HOBBY,
		storage: 1,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
	},
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		plan: CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION,
		storage: 10,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
	},
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		plan: CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE,
		storage: 10,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
	},
	[CLUSTER_PLANS.SANDBOX_2023]: {
		label: PLAN_LABEL[CLUSTER_PLANS.SANDBOX_2023],
		plan: CLUSTER_PLANS.SANDBOX_2023,
		storage: 40,
		memory: 8,
		nodes: 1,
		cpu: 2,
		storagePerNode: 40,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2023],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2023],
	},
	[CLUSTER_PLANS.STARTER_2023]: {
		label: PLAN_LABEL[CLUSTER_PLANS.STARTER_2023],
		plan: CLUSTER_PLANS.STARTER_2023,
		storage: 240,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2023],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2023],
		memory: 8,
		nodes: 3,
		cpu: 2,
		storagePerNode: 80,
	},
	[CLUSTER_PLANS.PRODUCTION_2023_1]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2023_1],
		plan: CLUSTER_PLANS.PRODUCTION_2023_1,
		storage: 480,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2023_1],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2023_1],
		memory: 16,
		nodes: 3,
		cpu: 4,
		storagePerNode: 160,
	},
};

export const regionsKeyMap = {
	asia: 'asia',
	eu: 'europe',
	us: 'america',
	other: 'other',
};

export const V7_ARC = '8.18.0-cluster';
export const V6_ARC = '8.18.0-cluster';
export const ARC_BYOC = '8.18.0-byoc';
export const V5_ARC = 'v5-0.0.1';
export const REACTIVESEARCH_BYOC = '8.17.0-byoc';

export const arcVersions = {
	7: V7_ARC,
	6: V6_ARC,
	5: V5_ARC,
	/* odfe versions start */
	0: V6_ARC,
	1: V7_ARC,
	/* odfe versions end */
};

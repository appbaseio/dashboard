import { ACC_API, BILLING_API } from '../../config';

export function getBillingStatus(id) {
	return fetch(`${BILLING_API}/api/me`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ c_id: id }),
	});
}

export function checkUserStatus() {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/user`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'content-type': 'application/json',
			},
		})
			.then(res => res.json())
			.then((res) => {
				if (res.body.c_id) return res.body.c_id;
				reject();
				return null;
			})
			.then(getBillingStatus)
			.then(res => res.json())
			.then((res) => {
				if (!res.message || res.plan === 'free') {
					resolve({
						isPaidUser: false,
					});
				}
				resolve({
					isPaidUser: true,
				});
			})
			.catch(() => {
				reject();
			});
	});
}

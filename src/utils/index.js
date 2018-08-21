import { ACC_API } from '../constants/config';

// eslint-disable-next-line
export async function getUser() {
	const response = await fetch(`${ACC_API}/user`, { credentials: 'include' });
	const data = await response.json();
	if (response.status >= 400) {
		throw new Error(data);
	}

	const user = {
		...data.body.details,
		c_id: data.body.c_id,
	};

	return user;
}

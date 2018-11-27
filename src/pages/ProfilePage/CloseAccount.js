import React from 'react';
import {
 Card, Alert, Button, Popconfirm, notification,
} from 'antd';

import { ACC_API } from '../../constants/config';

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

function removeAllCookies() {
	const cookiesString = document.cookie;
	const cookies = cookiesString.split(';');
	cookies.forEach((item) => {
		const key = item.split('=');
		document.cookie = `${key[0]} =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
}

const deleteUser = async () => {
	try {
		const response = await fetch(`${ACC_API}/user`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'content-type': 'application/json',
			},
		});
		const data = await response.json();
		notification.success({
			message: data.message,
		});
		localStorage.clear();
		removeAllCookies();
		window.location.href = logoutURL;
	} catch (err) {
		notification.error({
			message: 'Something went wrong. Please report to us if this bug persists',
		});
	}
};

const CloseAccount = () => (
	<Card title="Close Account">
		<Alert
			showIcon
			message="Warning"
			description="Closing your account is a permanent action and it cannot be undone!"
			type="warning"
			css={{
				marginBottom: 20,
			}}
		/>
		<Popconfirm
			placement="bottom"
			title="Are you sure you want to close your account?"
			onConfirm={deleteUser}
			okText="Yes"
			cancelText="No"
		>
			<Button type="danger">Close Account</Button>
		</Popconfirm>
	</Card>
);

export default CloseAccount;

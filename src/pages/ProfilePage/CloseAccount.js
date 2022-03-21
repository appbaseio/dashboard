import React from 'react';
import { css } from 'react-emotion';
import { Card, Alert, Button, Popconfirm, notification } from 'antd';
import { Widget } from '@typeform/embed-react';
import { ACC_API } from '../../constants/config';
import credsBox from './styles';

const closeAccCardStyles = css`
	.close-account-footer {
		position: absolute;
		bottom: 0px;
		width: 93%;
		background: white;
		height: 10%;
	}
`;

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

function removeAllCookies() {
	const cookiesString = document.cookie;
	const cookies = cookiesString.split(';');
	cookies.forEach(item => {
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
		if (window.Intercom) {
			window.Intercom('update', {
				plan: 'free',
				cluster_plan: 'unsubscribed',
			});
		}
		localStorage.clear();
		removeAllCookies();
		window.location.href = logoutURL;
	} catch (err) {
		notification.error({
			message:
				'Something went wrong. Please report to us if this bug persists',
		});
	}
};

const CloseAccount = () => (
	<Card
		title="Close Account"
		bodyStyle={{ height: 600, overflow: 'scroll' }}
		css={closeAccCardStyles}
	>
		<Alert
			showIcon
			message="Warning"
			description="Closing your account is a permanent action and it cannot be undone!"
			type="warning"
			css={{
				marginBottom: 20,
			}}
		/>
		<Widget
			id="QEktta"
			style={{ width: '100%', height: '100%', marginBottom: 25 }}
			className="my-form"
		/>
		<div className="close-account-footer">
			<Popconfirm
				placement="bottom"
				title="Are you sure you want to close your account?"
				onConfirm={deleteUser}
				okText="Yes"
				cancelText="No"
			>
				<Button type="danger">Close Account</Button>
			</Popconfirm>
		</div>
	</Card>
);

export default CloseAccount;

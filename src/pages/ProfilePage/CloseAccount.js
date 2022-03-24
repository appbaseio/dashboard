import React, { useEffect, useState } from 'react';
import { css } from 'react-emotion';
import { Card, Alert, Button, Popconfirm, notification } from 'antd';
// import DeleteFeedbackForm from './DeleteFeedbackForm';
import { ACC_API } from '../../constants/config';
import { getClusters } from '../ClusterPage/utils';
import credsBox from './styles';

const closeAccCardStyles = css`
	.close-account-footer {
		position: absolute;
		bottom: 0px;
		width: 93%;
		background: white;
		padding: 15px;
	}
	.success-message-container {
		display: flex;
		justify-content: center;
		padding: 15px;
		font-weight: 500px !important;
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

const CloseAccount = () => {
	const [availableActiveClusters, setAvailableActiveClusters] = useState(
		false,
	);
	useEffect(() => {
		getClusters()
			.then(clusters => {
				console.log(clusters);
				const activeClusters = clusters.filter(
					cluster => cluster.status === 'active',
				);
				if (activeClusters.length) setAvailableActiveClusters(true);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	return (
		<Card
			title="Close Account"
			style={{ height: 250 }}
			css={closeAccCardStyles}
		>
			<Alert
				showIcon
				message="Warning"
				description={
					<div>
						<div>
							Closing your account is a permanent action and it
							cannot be undone!
						</div>
						{availableActiveClusters ? (
							<div>
								This action needs the active clusters to be
								deleted.
							</div>
						) : null}
					</div>
				}
				type="warning"
			/>
			<div className="close-account-footer">
				<Popconfirm
					placement="bottom"
					title="Are you sure you want to close your account?"
					onConfirm={deleteUser}
					okText="Yes"
					cancelText="No"
				>
					<Button type="danger" disabled={availableActiveClusters}>
						Close Account
					</Button>
				</Popconfirm>
			</div>
		</Card>
	);
};

export default CloseAccount;

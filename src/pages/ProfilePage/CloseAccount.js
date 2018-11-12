import React from 'react';
import {
 Card, Alert, Button, Popconfirm,
} from 'antd';

const CloseAccount = () => (
	<Card title="Close Account">
		<Alert
			showIcon
			message="Warning"
			description="Closing your account is permanent and cannot be undone!"
			type="warning"
			css={{
				marginBottom: 20,
			}}
		/>
		<Popconfirm
			placement="bottom"
			title="Are you sure you want to close your account?"
			onConfirm={() => {}}
			okText="Yes"
			cancelText="No"
		>
			<Button type="danger">Close Account</Button>
		</Popconfirm>
	</Card>
);

export default CloseAccount;

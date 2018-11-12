import React from 'react';
import { Card, List, Switch } from 'antd';

const { Item } = List;

const data = [
	{
		id: 'newsletter',
		label: 'Newsletter',
		description: "Our monthly update on what's new with Appbase and the community.",
	},
	{
		id: 'announcements',
		label: 'Announcements',
		description: 'Company notifications and critical updates about Appbase you need to know.',
	},
	{
		id: 'feature',
		label: 'Product & Feature Updates',
		description:
			'Everything you need to know about Appbase features, integrations, and launches.',
	},
	{
		id: 'billing',
		label: 'Billing',
		description: 'Regular bill updates.',
	},
];

const Emails = () => (
	<Card title="Email Subscriptions">
		<List
			dataSource={data}
			bordered
			renderItem={item => (
				<Item actions={[<Switch defaultChecked onChange={() => {}} />]}>
					<Item.Meta title={item.label} description={item.description} />
				</Item>
			)}
		/>
	</Card>
);

export default Emails;

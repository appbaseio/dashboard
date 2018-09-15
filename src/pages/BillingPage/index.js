import React from 'react';
import { Card } from 'antd';
import Container from '../../components/Container';
import BannerHeader from '../../components/Banner/Header';
import PricingTable from '../../components/PricingTable';

const Billing = () => (
	<React.Fragment>
		<BannerHeader
			title="Upgrade your plan"
			description="Manage who can access your app data. Lorem iprum dolor sit amet lorem ipsum dolor sit. "
		/>
		<Container>
			<Card bodyStyle={{ padding: 0 }}>
				<PricingTable />
			</Card>
		</Container>
	</React.Fragment>
);

export default Billing;

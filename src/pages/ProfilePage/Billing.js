import { SelectOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { string } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const Billing = ({ userEmail }) => {
	const getBillingPortalURL = () => {
		let URL = 'https://billing.stripe.com/p/login/fZeeXudKqdV83rGdQQ';

		if (userEmail) {
			URL += `?prefilled_email=${encodeURIComponent(userEmail)}`;
		}

		return URL;
	};
	return (
		<Card title="Manage Billing">
			<Paragraph>
				ReactiveSearch partners with Stripe for customer billing. You
				can update payment method, view subscriptions, and get past
				invoices by opening the billing portal link below.
			</Paragraph>
			<Button
				type="primary"
				href={getBillingPortalURL()}
				target="_blank"
				icon={<SelectOutlined rotate={90} />}
			>
				Billing Settings and Invoice History
			</Button>
		</Card>
	);
};

Billing.propTypes = {
	userEmail: string,
};
Billing.defaultProps = {
	userEmail: '',
};

const mapStateToProps = state => ({
	userEmail: state.user?.data?.email ?? '',
});

export default connect(mapStateToProps)(Billing);

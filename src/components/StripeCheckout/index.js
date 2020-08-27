import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import StripeForm from './StripeForm';

import { STRIPE_KEY } from '../../constants';

const stripePromise = loadStripe(STRIPE_KEY.TEST);

const StripeCheckout = ({ visible, plan, price, onCancel, onSubmit }) => (
	<Modal
		visible={visible}
		footer={null}
		title={
			<div>
				<div
					style={{
						fontSize: '16px',
						fontWeight: 'bold',
						color: 'rgba(0,0,0,.85)',
						textAlign: 'center',
					}}
				>
					Subscribe for {plan} cluster
				</div>
				<p style={{ marginTop: 15, color: 'rgba(0, 0, 0, 0.65)' }}>
					Billed at <b>${price}/hr</b> at the end of the subscription
					cycle based on actual usage
				</p>
			</div>
		}
		destroyOnClose
		onCancel={onCancel}
	>
		<Elements stripe={stripePromise}>
			<StripeForm onSubmit={onSubmit} />
		</Elements>
	</Modal>
);

StripeCheckout.propTypes = {
	visible: PropTypes.bool.isRequired,
	plan: PropTypes.string.isRequired,
	price: PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default StripeCheckout;

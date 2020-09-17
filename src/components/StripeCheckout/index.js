import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import { Modal, Spin, Icon } from 'antd';

import StripeForm from './StripeForm';
import PaymentMethods from './PaymentMethods';

import { STRIPE_KEY } from '../../constants';
import { getPaymentMethods } from '../../pages/ClusterPage/utils';

const stripePromise = loadStripe(STRIPE_KEY.LIVE);

const VIEWS = {
	PAYMENT_METHODS: 'PAYTMENT_METHODS',
	CARD: 'CARD',
};

const StripeCheckout = ({ visible, plan, price, onCancel, onSubmit }) => {
	const [paymentMethods, setPaymentMethods] = useState({
		loading: true,
		methods: [],
	});
	const [view, setView] = useState(VIEWS.CARD);

	useEffect(() => {
		let isCancelled = false;

		async function fetchPaymentMethods() {
			const res = await getPaymentMethods();
			if (!isCancelled) {
				if ((res.payment_methods || []).length) {
					setView(VIEWS.PAYMENT_METHODS);
				}
				setPaymentMethods({
					loading: false,
					methods: res.payment_methods || [],
				});
			}
		}

		fetchPaymentMethods();

		return () => {
			isCancelled = true;
		};
	}, []);
	return (
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
						Billed at <b>${price}/hr</b> at the end of the
						subscription cycle based on actual usage
					</p>
				</div>
			}
			destroyOnClose
			onCancel={onCancel}
		>
			{paymentMethods.loading ? (
				<div
					style={{
						height: '100%',
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Spin
						indicator={
							<Icon
								type="loading"
								style={{ fontSize: 24 }}
								spin
							/>
						}
					/>
				</div>
			) : (
				<Elements stripe={stripePromise}>
					{view === VIEWS.PAYMENT_METHODS && (
						<PaymentMethods
							onSubmit={onSubmit}
							paymentMethods={paymentMethods.methods}
							onCardView={() => setView(VIEWS.CARD)}
						/>
					)}

					{view === VIEWS.CARD && (
						<StripeForm
							onSubmit={onSubmit}
							showBack={Boolean(paymentMethods.methods)}
							onBack={() => setView(VIEWS.PAYMENT_METHODS)}
						/>
					)}
				</Elements>
			)}
		</Modal>
	);
};

StripeCheckout.propTypes = {
	visible: PropTypes.bool.isRequired,
	plan: PropTypes.string.isRequired,
	price: PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default StripeCheckout;

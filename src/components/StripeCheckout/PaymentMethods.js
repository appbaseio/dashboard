import React from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, Button } from 'antd';
import styled from 'react-emotion';
import get from 'lodash/get';

const CardWrapper = styled.div`
	display: flex;
	cursor: pointer;
	border: 1px solid #e8e8e8;
	padding: 10px;
	border-radius: 3px;

	:hover {
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}
`;

const Dot = styled.span`
	height: 8px;
	width: 8px;
	margin: 0 2px;
	background: #000;
	border-radius: 50%;
`;

const CARD_BRANDS = {
	visa: `visa`,
	maestro: `maestro`,
	mastercard: `mastercard`,
	amex: `amex`,
};

const PaymentMethods = ({ onSubmit, paymentMethods, onCardView }) => {
	const onMethodClick = async () => {
		onSubmit({
			useDefaultPaymentMethod: true,
			// set default values for token and coupon
			token: { id: '' },
			coupon: '',
		});
	};
	return (
		<>
			<p>Use your current payment method</p>
			{paymentMethods.map(method => (
				<CardWrapper
					style={{ marginTop: 16, padding: 15 }}
					key={method.id}
					onClick={() => onMethodClick(method)}
				>
					<img
						src={`/static/images/cards/${CARD_BRANDS[
							get(method, 'card.brand')
						] || 'visa'}.png`}
						alt="visa"
						style={{ marginRight: 15, height: 50 }}
					/>
					<Card.Meta
						title={
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Dot />
								<Dot />
								<Dot />
								<Dot />
								<span style={{ marginLeft: 2 }}>{`${get(
									method,
									'card.last4',
								)}`}</span>
							</div>
						}
						description={`Expires on ${get(
							method,
							'card.exp_month',
						)}/${get(method, 'card.exp_year')}`}
					/>
				</CardWrapper>
			))}
			<br />
			<Divider>OR</Divider>

			<Button type="primary" size="large" onClick={onCardView} block>
				Update the payment method
			</Button>
		</>
	);
};

PaymentMethods.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onCardView: PropTypes.func.isRequired,
	paymentMethods: PropTypes.array.isRequired,
};
export default PaymentMethods;

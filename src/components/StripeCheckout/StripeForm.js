import React, { useState } from 'react';
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { Button, Alert } from 'antd';
import styled from 'react-emotion';
import { getCoupon } from '../../pages/ClusterPage/utils';

const Wrapper = styled.div`
	label {
		color: rgba(0, 0, 0, 0.65);
		letter-spacing: 0.025em;
	}

	input,
	.StripeElement {
		display: block;
		margin: 10px 0 20px 0;
		max-width: 500px;
		padding: 10px 14px;
		font-size: 1em;
		border: 1px solid #e8e8e8;
		outline: 0;
		background: white;
	}

	input::placeholder {
		color: #aab7c4;
	}

	input:focus,
	.StripeElement--focus {
		/* box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
			rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
		-webkit-transition: all 150ms ease; */
		transition: all 150ms ease;
	}

	.StripeElement.IdealBankElement,
	.StripeElement.FpxBankElement,
	.StripeElement.PaymentRequestButton {
		padding: 0;
	}

	.StripeElement.PaymentRequestButton {
		height: 40px;
	}
`;

const options = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: '"Open Sans","Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#aab7c4',
			},
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a',
		},
	},
};

const StripeForm = ({ onSubmit }) => {
	const [error, setError] = useState(null);
	const [couponCode, setCouponCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();
	const handleError = err => {
		setError(err);
		setTimeout(() => {
			setError(null);
			setIsLoading(false);
		}, 7000);
	};
	const handleSubmit = async event => {
		try {
			event.preventDefault();

			if (!stripe || !elements) {
				// Stripe.js has not loaded yet. Make sure to disable
				// form submission until Stripe.js has loaded.
				return;
			}

			setIsLoading(true);
			setError(null);

			if (couponCode.trim()) {
				// validate couponCode
				const res = await getCoupon(couponCode);
				if (!res.valid || res.message) {
					handleError({
						message: res.message || `Invalid coupon code`,
					});
					setIsLoading(false);

					return;
				}
			}

			const payload = await stripe.createToken(
				elements.getElement(CardNumberElement),
			);

			setIsLoading(false);

			if (payload.error) {
				handleError(payload.error);
			}

			onSubmit(payload.token, couponCode.trim());
		} catch (err) {
			console.log(err.message);
			handleError(err);
		}
	};
	return (
		<Wrapper>
			<form onSubmit={handleSubmit}>
				<label>
					Card number
					<CardNumberElement
						autocomplete="cc-number"
						options={options}
					/>
				</label>
				<div
					style={{ display: 'flex', justifyContent: 'space-between' }}
				>
					<label style={{ marginRight: 15, flex: 1 }}>
						Expiration date
						<CardExpiryElement
							autocomplete="cc-exp"
							options={options}
						/>
					</label>
					<label style={{ flex: 1 }}>
						CVC
						<CardCvcElement options={options} />
					</label>
				</div>
				<label>
					Discount Coupon Code
					<input
						type="text"
						className="StripeElement"
						placeholder="eg PRODUCTHUNT2020"
						onChange={e => {
							setCouponCode(e.target.value);
						}}
						style={{
							width: '100%',
						}}
					/>
				</label>
				{error && (
					<>
						<Alert type="error" showIcon message={error.message} />
						<br />
					</>
				)}

				<Button
					type="primary"
					block
					htmlType="submit"
					disabled={!stripe || isLoading}
					loading={isLoading}
					size="large"
				>
					Subscribe
				</Button>
				<div
					style={{ textAlign: 'center', fontSize: 12, marginTop: 15 }}
				>
					<i>Powered by Stripe</i>
				</div>
			</form>
		</Wrapper>
	);
};

StripeForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

export default StripeForm;

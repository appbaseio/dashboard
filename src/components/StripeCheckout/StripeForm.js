import React, { useState } from 'react';
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { Button, Alert, Icon } from 'antd';
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

const StripeForm = ({ onSubmit, showBack, onBack }) => {
	const [error, setError] = useState(null);
	const [couponCode, setCouponCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
	const [couponData, setCouponData] = useState(null);

	const stripe = useStripe();
	const elements = useElements();
	const handleError = err => {
		setError(err);
		setTimeout(() => {
			setError(null);
			setIsLoading(false);
		}, 7000);
	};

	const handleApplyCoupon = async event => {
		event.preventDefault();
		setIsLoadingCoupon(true);
		setError(null);
		try {
			if (couponCode.trim()) {
				// validate couponCode
				const res = await getCoupon(couponCode);
				if (!res.valid || res.message) {
					setError({
						message: `The coupon is invalid`,
					});
					setIsLoadingCoupon(false);
					return;
				}

				setCouponData(res);
				setIsLoadingCoupon(false);
			}
		} catch (err) {
			setError({
				message: `The coupon is invalid`,
			});
			setIsLoadingCoupon(false);
		}
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

			const payload = await stripe.createToken(
				elements.getElement(CardNumberElement),
			);

			setIsLoading(false);

			if (payload.error) {
				handleError(payload.error);
			}

			onSubmit({
				token: payload.token,
				coupon: couponCode.trim(),
				useDefaultPaymentMethod: false,
			});
		} catch (err) {
			console.log(err.message);
			handleError(err);
		}
	};

	return (
		<Wrapper>
			<form>
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
				<label>Coupon Code</label>
				<div
					style={{
						display: 'flex',
						alignItem: 'center',
						marginTop: 10,
						marginBottom: 20,
					}}
				>
					<input
						type="text"
						className="StripeElement"
						placeholder=""
						onChange={e => {
							setCouponCode(e.target.value);
						}}
						style={{ width: '60%', margin: 0 }}
					/>
					<Button
						disabled={!couponCode.trim() || isLoadingCoupon}
						loading={isLoadingCoupon}
						icon="tag"
						onClick={handleApplyCoupon}
						htmlType="button"
						size="large"
						type="primary"
						style={{
							marginLeft: 10,
							height: 43,
							borderRadius: 2,
							width: '40%',
						}}
						block
					>
						Apply Coupon
					</Button>
				</div>
				{couponData && couponCode.trim() && (
					<>
						<Alert
							type="success"
							showIcon
							icon={<Icon type="tags" />}
							message={`Coupon has been applied successfully. You will receive ${
								couponData.amount_off
									? `${couponData.amount_off}`
									: `${couponData.percent_off}%`
							} off ${
								couponData.duration === 'once.'
									? 'once'
									: `${
											couponData.duration === 'repeating'
												? `for ${couponData.duration_in_months} months.`
												: `for your subscription duration.`
									  }`
							}`}
						/>
						<br />
					</>
				)}
				{error && (
					<>
						<Alert type="error" showIcon message={error.message} />
						<br />
					</>
				)}

				<Button
					type="primary"
					block
					onClick={handleSubmit}
					htmlType="button"
					disabled={!stripe || isLoading}
					loading={isLoading}
					size="large"
					style={{ borderRadius: 2, height: 43 }}
				>
					Subscribe
				</Button>
				{showBack && (
					<Button type="link" block onClick={onBack}>
						Use existing cards
					</Button>
				)}
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
	showBack: PropTypes.bool,
	onBack: PropTypes.func,
};

export default StripeForm;

import React from 'react';
import { CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import get from 'lodash/get';

import { emailBtn, inputStyles } from './styles';
import { ACC_API } from '../../constants/config';
import { getUrlParams } from '../../utils/helper';

class EmailAuth extends React.Component {
	state = {
		emailInput: '',
		isLoading: false,
		showOtp: false,
		otp: '',
	};

	handleInput = e => {
		const {
			target: { name, value },
		} = e;
		this.setState({
			[name]: value,
		});
	};

	toggleLoading = () => {
		this.setState(({ isLoading }) => ({
			isLoading: !isLoading,
		}));
	};

	handleEmailSubmission = async () => {
		const { emailInput } = this.state;
		const { isSignup } = this.props;
		this.toggleLoading();

		try {
			const disposableEmailResponse = await fetch(
				`https://open.kickbox.com/v1/disposable/${emailInput}`,
			);

			const disposableEmailData = await disposableEmailResponse.json();

			if (
				get(disposableEmailData, 'disposable') === true ||
				(isSignup && emailInput.indexOf('+') !== -1)
			) {
				this.toggleLoading();
				message.error(
					'Please use a valid e-mail address. We do not allow disposable addresses or email subaddressing (+ sign use). Reach out to us at support@reactivesearch.io if you believe this is an error.',
				);
				return;
			}
		} catch (e) {
			// Do nothing
		}

		try {
			const response = await fetch(`${ACC_API}/user/email`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					email: emailInput,
				}),
			});
			const data = await response.json();
			if (response.status >= 400) {
				message.error(data.message);
				this.toggleLoading();
			} else {
				this.toggleLoading();
				message.success(data.message);
				this.setState({
					showOtp: true,
				});
			}
		} catch (e) {
			message.error('Something went Wrong.');
		}
	};

	verifyOtp = async () => {
		const { emailInput, otp } = this.state;
		const { isSignup } = this.props;
		const params = getUrlParams(window.location.search);
		this.toggleLoading();
		try {
			const response = await fetch(`${ACC_API}/user/verify`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					email: emailInput,
					otp,
				}),
			});
			const data = await response.json();
			if (response.status >= 400) {
				message.error(data.message);
				this.toggleLoading();
			} else {
				message.success('OTP Successfully Verified!');
				this.toggleLoading();
				if (params.returnURL && !isSignup) {
					window.location.href = params.returnURL;
				} else {
					window.location.reload();
				}
			}
		} catch (e) {
			message.error('Something went Wrong.');
		}
	};

	render() {
		const {
            isEmailAuth, toggleEmailAuth, authText, disabled
        } = this.props; // prettier-ignore
		const {
            isLoading, showOtp, emailInput, otp
        } = this.state; // prettier-ignore
		return (
			<React.Fragment>
				{isEmailAuth ? (
					<Input
						placeholder="Enter Email"
						name="emailInput"
						disabled={showOtp}
						onChange={this.handleInput}
						size="large"
						className={inputStyles}
						value={emailInput}
					/>
				) : null}
				{showOtp ? (
					<React.Fragment>
						<Input
							placeholder="Enter OTP"
							name="otp"
							onChange={this.handleInput}
							value={otp}
							size="large"
							className={inputStyles}
						/>
						<Button
							onClick={this.verifyOtp}
							icon={<CheckCircleOutlined />}
							size="large"
							loading={isLoading}
							className={emailBtn}
							block
						>
							Verify OTP
						</Button>
					</React.Fragment>
				) : (
					<Button
						onClick={
							isEmailAuth
								? this.handleEmailSubmission
								: toggleEmailAuth
						}
						icon={isEmailAuth ? null : <MailOutlined />}
						size="large"
						disabled={disabled}
						loading={isLoading}
						className={emailBtn}
						type="primary"
						block
					>
						{isEmailAuth ? 'Receive OTP' : authText}
					</Button>
				)}
			</React.Fragment>
		);
	}
}

export default EmailAuth;

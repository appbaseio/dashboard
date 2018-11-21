import React from 'react';
import { connect } from 'react-redux';
import {
 Card, Button, Icon, Input, message,
} from 'antd';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logo from '../../components/Logo';
import { ACC_API } from '../../constants/config';
import {
 container, card, githubBtn, googleBtn, gitlabBtn, emailBtn, inputStyles,
} from './styles';

const getLoginURL = provider => `${ACC_API}/login/${provider}?next=${window.location.origin}`;

class LoginPage extends React.Component {
	state = {
		isEmailLogin: false,
	};

	toggleEmailLogin = () => {
		this.setState(({ isEmailLogin }) => ({
			isEmailLogin: !isEmailLogin,
			emailInput: '',
			isLoading: false,
			showOtp: false,
			otp: '',
		}));
	};

	handleInput = (e) => {
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
		this.toggleLoading();
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
				message.success(data.message);
				this.toggleLoading();
				window.location.reload();
			}
		} catch (e) {
			message.error('Something went Wrong.');
		}
	};

	render() {
		const { user } = this.props;
		const {
			isEmailLogin, emailInput, isLoading, showOtp, otp,
		} = this.state; // prettier-ignore
		if (user.data) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<Logo width={200} />
				<Card className={card} bordered={false}>
					<h2>Sign in to get started</h2>
					{isEmailLogin ? (
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
								icon="check"
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
								isEmailLogin ? this.handleEmailSubmission : this.toggleEmailLogin
							}
							icon={isEmailLogin ? '' : 'mail'}
							size="large"
							loading={isLoading}
							className={emailBtn}
							type="primary"
							block
						>
							{isEmailLogin ? 'Submit' : 'Sign in via Email'}
						</Button>
					)}
					{isEmailLogin || (
						<React.Fragment>
							<Button
								href={getLoginURL('github')}
								icon="github"
								className={githubBtn}
								size="large"
								block
							>
								Sign in via GitHub
							</Button>
							<Button
								href={getLoginURL('google')}
								icon="google"
								className={googleBtn}
								size="large"
								block
							>
								Sign in via Google
							</Button>
							<Button
								href={getLoginURL('gitlab')}
								icon="gitlab"
								className={gitlabBtn}
								size="small"
								block
							>
								Sign in via Gitlab
							</Button>
						</React.Fragment>
					)}
				</Card>

				<Link to="/signup">
					<Button
						size="large"
						ghost
						css={{
							border: 0,
							boxShadow: 'none',
							color: '#424242',
							margin: '20px 0',
							fontSize: 18,
							letterSpacing: '0.02rem',
						}}
					>
						New to appbase? &nbsp; Signup here
						<Icon type="arrow-right" />
					</Button>
				</Link>
			</section>
		);
	}
}

LoginPage.propTypes = {
	user: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user }) => ({
	user,
});

export default connect(
	mapStateToProps,
	null,
)(LoginPage);

import React from 'react';
import { connect } from 'react-redux';
import {
	ArrowRightOutlined,
	GithubOutlined,
	GitlabOutlined,
	GoogleOutlined,
} from '@ant-design/icons';
import { Card, Button, Checkbox } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import EmailAuth from '../LoginPage/EmailAuth';
import LoginContainer from '../../components/LoginContainer';
import { ACC_API } from '../../constants/config';
import ReactivesearchLogo from '../../components/Logo/ReactivesearchLogo';
import { card, githubBtn, googleBtn, gitlabBtn } from '../LoginPage/styles';
import { checkbox } from './styles';

const getSignupURL = (provider, search) =>
	`${ACC_API}/login/${provider}?next=${window.location.origin}${search}`;

class SignupPage extends React.Component {
	state = {
		hasAgreedTOS: false,
		hasSubscribed: true,
		isEmailSignup: false,
	};

	toggleEmailSignup = () => {
		this.setState(({ isEmailSignup }) => ({
			isEmailSignup: !isEmailSignup,
		}));
	};

	handleChange = e => {
		const {
			target: { name: checkboxName },
		} = e;

		this.setState(state => ({
			...state,
			[checkboxName]: !state[checkboxName],
		}));
	};

	render() {
		const {
			user: { data },
			location: { search },
		} = this.props;
		const { hasSubscribed, hasAgreedTOS, isEmailSignup } = this.state;
		if (data) {
			return <Redirect to={`/${search}`} />;
		}
		return (
			<LoginContainer>
				<React.Fragment>
					<ReactivesearchLogo width={250} />
					<Card className={card} bordered={false}>
						<h2>Sign up to get started</h2>

						<section style={{ marginBottom: 20 }}>
							<Checkbox
								onChange={this.handleChange}
								className={checkbox}
								name="hasAgreedTOS"
								checked={hasAgreedTOS}
							>
								<div
									style={{
										display: 'inline-block',
										paddingLeft: 5,
									}}
								>
									By creating an account, you agree to our{' '}
									<a
										href="https://www.appbase.io/tos"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											height: 'auto',
											display: 'inline',
											fontSize: '14px',
										}}
									>
										Terms of Service
									</a>{' '}
									and{' '}
									<a
										href="https://www.appbase.io/tos"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											height: 'auto',
											display: 'inline',
											fontSize: '14px',
										}}
									>
										Privacy Policy
									</a>
									.
								</div>
							</Checkbox>
							<Checkbox
								onChange={this.handleChange}
								className={checkbox}
								name="hasSubscribed"
								checked={hasSubscribed}
							>
								<div
									style={{
										display: 'inline-block',
										paddingLeft: 5,
									}}
								>
									Receive occasional product updates.
								</div>
							</Checkbox>
						</section>
						{isEmailSignup || (
							<React.Fragment>
								<Button
									href={getSignupURL('github', search)}
									icon={<GithubOutlined />}
									className={githubBtn}
									disabled={!hasAgreedTOS}
									size="large"
									style={{ border: 0 }}
								>
									Sign up with GitHub
								</Button>

								<Button
									href={getSignupURL('google', search)}
									icon={<GoogleOutlined />}
									disabled={!hasAgreedTOS}
									className={googleBtn}
									size="large"
									style={{ border: 0 }}
								>
									Sign up with Google
								</Button>

								<Button
									href={getSignupURL('gitlab', search)}
									icon={<GitlabOutlined />}
									disabled={!hasAgreedTOS}
									className={gitlabBtn}
									size="large"
									style={{ border: 0 }}
								>
									Sign up with Gitlab
								</Button>
							</React.Fragment>
						)}
						<EmailAuth
							disabled={!hasAgreedTOS}
							isEmailAuth={isEmailSignup}
							toggleEmailAuth={this.toggleEmailSignup}
							authText="Sign up via e-mail"
							isSignup
						/>
					</Card>

					<Link to="/login">
						<Button
							size="large"
							ghost
							style={{
								border: 0,
								boxShadow: 'none',
								color: '#424242',
								margin: '20px 0',
								fontSize: 18,
								letterSpacing: '0.02rem',
								whiteSpace: 'inherit',
							}}
						>
							Already have account? &nbsp; Login here
							<ArrowRightOutlined />
						</Button>
					</Link>
				</React.Fragment>
			</LoginContainer>
		);
	}
}

SignupPage.propTypes = {
	user: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user }) => ({
	user,
});

export default connect(mapStateToProps, null)(SignupPage);

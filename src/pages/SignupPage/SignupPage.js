import React from 'react';
import { connect } from 'react-redux';
import {
 Card, Button, Icon, Checkbox,
} from 'antd';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logo from '../../components/Logo';
import { ACC_API } from '../../constants/config';

import {
 container, card, githubBtn, googleBtn, gitlabBtn,
} from '../LoginPage/styles';
import { checkbox } from './styles';

const getSignupURL = provider => `${ACC_API}/login/${provider}?next=${window.location.origin}`;

class SignupPage extends React.Component {
	state = {
		hasAgreedTOS: false,
		hasSubscribed: false,
	};

	handleChange = (e) => {
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
		} = this.props;
		const { hasSubscribed, hasAgreedTOS } = this.state;
		if (data) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<Logo width={200} />

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
								By creating an account, you agree to our Terms of Service and
								Privacy Policy.
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
								Yes, I would like to receive a monthly e-mail on Appbase products,
								use-cases and promotions via e-mail.
							</div>
						</Checkbox>
					</section>

					<Button
						href={getSignupURL('github')}
						icon="github"
						className={githubBtn}
						disabled={!hasAgreedTOS}
						size="small"
					>
						Sign up with GitHub
					</Button>

					<Button
						href={getSignupURL('google')}
						icon="google"
						disabled={!hasAgreedTOS}
						className={googleBtn}
						size="small"
					>
						Sign up with Google
					</Button>

					<Button
						href={getSignupURL('gitlab')}
						icon="gitlab"
						disabled={!hasAgreedTOS}
						className={gitlabBtn}
						size="small"
					>
						Sign up with Gitlab
					</Button>
				</Card>

				<Button
					size="large"
					ghost
					css={{
						border: 0,
						color: '#424242',
						margin: '20px 0',
						fontSize: 18,
						letterSpacing: '0.02rem',
					}}
					href="/login"
				>
					Already have account? &nbsp; Login here
					<Icon type="arrow-right" />
				</Button>
			</section>
		);
	}
}

SignupPage.propTypes = {
	user: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user }) => ({
	user,
});

export default connect(
	mapStateToProps,
	null,
)(SignupPage);

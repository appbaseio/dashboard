import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import EmailAuth from './EmailAuth';
import Logo from '../../components/Logo';
import { ACC_API } from '../../constants/config';
import {
 container, card, githubBtn, googleBtn, gitlabBtn,
} from './styles';

const getLoginURL = provider => `${ACC_API}/login/${provider}?next=${window.location.origin}`;

class LoginPage extends React.Component {
	state = {
		isEmailLogin: false,
	};

	toggleEmailLogin = () => {
		this.setState(({ isEmailLogin }) => ({
			isEmailLogin: !isEmailLogin,
		}));
	};

	render() {
		const {
			user,
			location: { search },
		} = this.props;
		const { isEmailLogin } = this.state;
		if (user.data) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<Logo width={200} />
				<Card className={card} bordered={false}>
					<h2>Sign in to get started</h2>
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
					<EmailAuth
						isEmailAuth={isEmailLogin}
						toggleEmailAuth={this.toggleEmailLogin}
						authText="Sign in via Email"
					/>
				</Card>

				<Link to={`/signup${search}`}>
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

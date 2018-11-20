import React from 'react';
import { connect } from 'react-redux';
import {
 Card, Button, Icon, Input,
} from 'antd';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
			emailInput: '',
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

	render() {
		const { user } = this.props;
		const { isEmailLogin, emailInput } = this.state;
		if (user.data) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<Logo width={200} />
				<Card className={card} bordered={false}>
					<h2>Sign in to get started</h2>
					<Button onClick={this.toggleEmailLogin} icon="mail" size="large" block>
						{isEmailLogin ? 'Hide Input' : 'Sign in via Email'}
					</Button>
					{isEmailLogin ? (
						<Input
							placeholder="Enter Email"
							name="emailInput"
							onChange={this.handleInput}
							value={emailInput}
						/>
					) : null}
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

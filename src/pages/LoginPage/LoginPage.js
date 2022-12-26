import React from 'react';
import { connect } from 'react-redux';
import {
	ArrowRightOutlined,
	GithubOutlined,
	GitlabOutlined,
	GoogleOutlined,
} from '@ant-design/icons';
import { Card, Button } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import EmailAuth from './EmailAuth';
import ReactivesearchLogo from '../../components/Logo/ReactivesearchLogo';
import { ACC_API } from '../../constants/config';
import { container, card, githubBtn, googleBtn, gitlabBtn } from './styles';
import { getUrlParams } from '../../utils/helper';

const getLoginURL = (provider, returnURL) =>
	`${ACC_API}/login/${provider}?next=${returnURL}`;

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

		const params = getUrlParams(window.location.search);

		let returnURL = window.location.origin;
		if (params.returnURL) {
			({ returnURL } = params);
			returnURL = returnURL.replace(/"/g, '');
		}

		if (params['insights-sidebar'] && params['insights-id']) {
			returnURL = `${returnURL}/?insights-id=${params['insights-id']}&auto-navigate=true`;
		}
		const { isEmailLogin } = this.state;
		if (user.data) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<ReactivesearchLogo width={250} />
				<Card className={card} bordered={false}>
					<h2>Sign in to get started</h2>
					{isEmailLogin || (
						<React.Fragment>
							<Button
								href={getLoginURL('github', returnURL)}
								icon={<GithubOutlined />}
								className={githubBtn}
								size="large"
								block
							>
								Sign in via GitHub
							</Button>
							<Button
								href={getLoginURL('google', returnURL)}
								icon={<GoogleOutlined />}
								className={googleBtn}
								size="large"
								block
							>
								Sign in via Google
							</Button>
							<Button
								href={getLoginURL('gitlab', returnURL)}
								icon={<GitlabOutlined />}
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
							whiteSpace: 'inherit',
						}}
					>
						New to reactivesearch.io? &nbsp; Signup here
						<ArrowRightOutlined />
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

export default connect(mapStateToProps, null)(LoginPage);

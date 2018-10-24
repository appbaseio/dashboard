import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import * as Sentry from '@sentry/browser';

import Loader from './components/Loader';
import Logo from './components/Logo';
import PrivateRoute from './pages/LoginPage/PrivateRoute';
import Wrapper from './pages/Wrapper';
import { loadUser } from './actions';

Sentry.init({
	dsn: 'https://8e07fb23ba8f46d8a730e65496bb7f00@sentry.io/58038',
});

// routes
const LoginPage = Loadable({
	loader: () => import('./pages/LoginPage'),
	loading: Loader,
});

const SignupPage = Loadable({
	loader: () => import('./pages/SignupPage'),
	loading: Loader,
});

class Dashboard extends Component {
	state = {
		error: false,
	};

	componentDidMount() {
		const { loadAppbaseUser } = this.props;
		loadAppbaseUser();
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: true,
		});
		Sentry.withScope((scope) => {
			Object.keys(errorInfo).forEach((key) => {
				scope.setExtra(key, errorInfo[key]);
			});
			Sentry.captureException(error);
		});
	}

	render() {
		const { user } = this.props;
		const { error } = this.state;

		if (user.isLoading) {
			return <Loader />;
		}

		if (error) {
			return (
				<section
					css={{
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						height: '100vh',
					}}
				>
					<Logo />
					<h2 style={{ marginTop: 20 }}>Something went wrong!</h2>
					<p>Our team has been notified about this.</p>
					<section
						css={{
							display: 'flex',
						}}
					>
						<Button href="/" size="large" type="primary">
							<Icon type="home" />
							Back to Dashboard
						</Button>
						<Button
							href="mailto:info@appbase.io"
							target="_blank"
							size="large"
							type="danger"
							css={{ marginLeft: '8' }}
						>
							<Icon type="info-circle" />
							Report Bug
						</Button>
					</section>
				</section>
			);
		}

		return (
			<Router>
				<Fragment>
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/signup" component={SignupPage} />
					<PrivateRoute user={user} component={Wrapper} />
				</Fragment>
			</Router>
		);
	}
}

Dashboard.propTypes = {
	user: PropTypes.object.isRequired,
	loadAppbaseUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
	user,
});

const mapDispatchToProps = dispatch => ({
	loadAppbaseUser: () => dispatch(loadUser()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Dashboard);

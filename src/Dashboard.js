import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as Sentry from '@sentry/browser';

import Loader from './components/Loader';
import Logo from './components/Logo';
import PrivateRoute from './pages/LoginPage/PrivateRoute';
import Wrapper from './pages/Wrapper';
import { loadApps, loadUser, setUser, setUserError } from './actions';
import { getUserPlan } from './batteries/modules/actions';

Sentry.init({
	dsn: 'https://8e07fb23ba8f46d8a730e65496bb7f00@sentry.io/58038',
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
		Sentry.withScope(scope => {
			scope.setExtras(errorInfo);
			Sentry.captureException(error);
		});
	}

	render() {
		const {
			user,
			setAppbaseUser,
			loadAppbaseUser,
			setAppbaseUserError,
			fetchUserPlan,
			setApps,
		} = this.props;
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
							<HomeOutlined />
							Back to Dashboard
						</Button>
						<Button
							href="mailto:support@appbase.io"
							target="_blank"
							size="large"
							danger
							css={{ marginLeft: '8' }}
						>
							<InfoCircleOutlined />
							Report Bug
						</Button>
					</section>
				</section>
			);
		}

		return (
			<Router>
				<Fragment>
					<PrivateRoute
						user={user}
						setAppbaseUser={setAppbaseUser}
						loadAppbaseUser={loadAppbaseUser}
						component={() => <Wrapper user={user} />}
						setAppbaseUserError={setAppbaseUserError}
						fetchUserPlan={fetchUserPlan}
						setApps={setApps}
					/>
				</Fragment>
			</Router>
		);
	}
}

Dashboard.propTypes = {
	user: PropTypes.object.isRequired,
	loadAppbaseUser: PropTypes.func.isRequired,
	setAppbaseUser: PropTypes.func.isRequired,
	setAppbaseUserError: PropTypes.func.isRequired,
	fetchUserPlan: PropTypes.func.isRequired,
	setApps: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
	user,
});

const mapDispatchToProps = dispatch => ({
	loadAppbaseUser: () => dispatch(loadUser()),
	setAppbaseUser: userObj => dispatch(setUser(userObj)),
	setAppbaseUserError: errorObj => dispatch(setUserError(errorObj)),
	fetchUserPlan: () => dispatch(getUserPlan()),
	setApps: apps => dispatch(loadApps(apps)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

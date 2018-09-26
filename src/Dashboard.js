import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Loader from './components/Loader';
import PrivateRoute from './pages/LoginPage/PrivateRoute';
import Wrapper from './pages/Wrapper';
import { loadUser } from './actions';

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
	componentDidMount() {
		const { loadAppbaseUser } = this.props;
		loadAppbaseUser();
	}

	render() {
		const { user } = this.props;

		if (user.isLoading) {
			return <Loader />;
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

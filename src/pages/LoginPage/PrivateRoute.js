import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const AUTH_ROUTES = ['/login', '/signup'];

const PrivateRoute = ({ component: Component, user, ...rest }) => (
	<Route
		{...rest}
		render={props => (user.data ? (
				<Component {...props} />
			) : AUTH_ROUTES.includes(window.location.pathname) ? null : (
				<Redirect to="/login" />
			))
		}
	/>
);

PrivateRoute.propTypes = {
	user: PropTypes.object.isRequired,
};

export default PrivateRoute;

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import HelpChat from '../../components/HelpChat';

const AUTH_ROUTES = ['/login', '/signup'];

const PrivateRoute = ({ component: Component, user, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			user.data ? (
				<React.Fragment>
					<Component {...props} />
					<HelpChat user={user.data} />
				</React.Fragment>
			) : AUTH_ROUTES.includes(window.location.pathname) ? null : (
				<Redirect
					to={`/login?returnURL=${window.location.origin}${window.location.pathname}`}
				/>
			)
		}
	/>
);

PrivateRoute.propTypes = {
	user: PropTypes.object.isRequired,
};

export default PrivateRoute;

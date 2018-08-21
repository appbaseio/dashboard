import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, user, ...rest }) => (
	<Route
		{...rest}
		render={props => (user.data ? <Component {...props} /> : <Redirect to="/login" />)}
	/>
);

PrivateRoute.propTypes = {
	user: PropTypes.object.isRequired,
};

export default PrivateRoute;

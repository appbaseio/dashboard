import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
	<Route
		{...rest}
		render={props => (isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />)}
	/>
);

PrivateRoute.defaultProps = {
	isLoggedIn: false,
};

PrivateRoute.propTypes = {
	isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
	isLoggedIn: state.isLoggedIn,
});

export default connect(
	mapStateToProps,
	null,
)(PrivateRoute);

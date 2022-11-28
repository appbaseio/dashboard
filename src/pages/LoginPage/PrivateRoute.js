import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';

import HelpChat from '../../components/HelpChat';
import Loader from '../../components/Loader';
import { injectAuthTokenHeaderIntoFetchGlobally } from '../../utils/helper';
import { createUserIfNew, getUser } from '../../utils';

const PrivateRoute = ({
	component: Component,
	user,
	loadAppbaseUser,
	setAppbaseUser,
	...rest
}) => {
	const {
		isAuthenticated,
		getAccessTokenSilently,
		isLoading,
		loginWithRedirect,
		getIdTokenClaims,
	} = useAuth0();

	const getAuth0AccessToken = async () => {
		try {
			loadAppbaseUser();
			const accessToken = await getAccessTokenSilently();

			// https://github.com/auth0/auth0-spa-js/issues/693#issuecomment-757125378
			const token_id = (await getIdTokenClaims()).__raw;

			if (accessToken) {
				window.localStorage.setItem('AUTH_0_ACCESS_TOKEN', accessToken);
				injectAuthTokenHeaderIntoFetchGlobally();

				// generic request to check whether user exists in appbasde DB,
				// if not then we automatically sign him in based on auth0 token_id
				await createUserIfNew(token_id);

				const { user: userObj } = await getUser();

				setAppbaseUser(userObj);
			}
		} catch (error) {
			console.error('🚀 Error getting user from ACCAPI', error);
		}
	};

	useEffect(() => {
		if (isAuthenticated && !user.data) {
			getAuth0AccessToken();
		}
	}, [isAuthenticated]);

	if (!isAuthenticated && !isLoading) {
		if (!user.data) {
			loginWithRedirect();
		}

		return <Loader />;
	}

	if (!isAuthenticated && !user.data) {
		return <Loader />;
	}
	console.log(
		'🚀 ~ file: PrivateRoute.js ~ line 58 ~ isAuthenticated && !user.data',
		isAuthenticated,
		user.data,
	);
	return (
		<Route
			{...rest}
			render={props => {
				return (
					<React.Fragment>
						<Component {...props} />
						<HelpChat user={user.data} />
					</React.Fragment>
				);
			}}
		/>
	);
};

PrivateRoute.propTypes = {
	user: PropTypes.object.isRequired,
	component: PropTypes.node,
	loadAppbaseUser: PropTypes.func.isRequired,
	setAppbaseUser: PropTypes.func.isRequired,
};

export default PrivateRoute;

import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';

import HelpChat from '../../components/HelpChat';
import Loader from '../../components/Loader';
import { injectAuthTokenHeaderIntoFetchGlobally } from '../../utils/helper';
import { getUser } from '../../utils';

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
	} = useAuth0();

	const getAuth0AccessToken = async () => {
		try {
			loadAppbaseUser();
			const accessToken = await getAccessTokenSilently();
			if (accessToken) {
				window.localStorage.setItem('AUTH_0_ACCESS_TOKEN', accessToken);

				injectAuthTokenHeaderIntoFetchGlobally();

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

import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';

import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { Button } from 'antd';
import { css } from 'emotion';
import HelpChat from '../../components/HelpChat';
import Loader from '../../components/Loader';
import { injectAuthTokenHeaderIntoFetchGlobally } from '../../utils/helper';
import { createUserIfNew, getUser } from '../../utils';
import webAuth from '../../utils/WebAuthProxy';

const parseHash = (hashParam = window.location.hash) => {
	const hash = hashParam.substring(1);
	const params = {};
	hash.split('&').forEach(hk => {
		const temp = hk.split('=');
		const key = temp[0];
		const value = temp[1];
		params[key] = value;
	});
	return params;
};

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

	const [isAuthenticatedState, setIsAuthenticatedState] = useState(
		isAuthenticated,
	);

	const getAuth0AccessToken = async () => {
		try {
			loadAppbaseUser();
			let accessToken;
			let token_id;
			if (window.location.hash) {
				const { access_token, id_token } = parseHash(
					window.location.hash,
				);
				if (access_token) {
					accessToken = access_token;
				}
				if (id_token) {
					token_id = id_token;
				}
			}

			if (!accessToken) {
				accessToken = await getAccessTokenSilently(); // https://github.com/auth0/auth0-spa-js/issues/693#issuecomment-757125378
			}

			if (!token_id) {
				token_id = (await getIdTokenClaims()).__raw;
			}

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
		if (isAuthenticated) setIsAuthenticatedState(isAuthenticated);
	}, [isAuthenticated]);

	useEffect(() => {
		if (isAuthenticatedState && !user.data) {
			getAuth0AccessToken();
		}
	}, [isAuthenticatedState]);

	useEffect(() => {
		if (window.location.hash) {
			const { access_token } = parseHash(window.location.hash);

			if (access_token) {
				if (!isAuthenticatedState) {
					setIsAuthenticatedState(true);
				}
			}
		}
	}, []);

	useGoogleOneTapLogin({
		disabled:
			isAuthenticated ||
			parseHash().access_token ||
			isLoading ||
			isAuthenticatedState ||
			(user && user.data),
		onError: () => loginWithRedirect(),
		onSuccess: response => {
			try {
				if (!isAuthenticatedState && (!user || !user.data)) {
					webAuth.authorize({
						connection: 'google-oauth2',
						login_hint: response.email,
						responseType: 'token id_token',
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		googleAccountConfigs: {
			client_id:
				'860445814108-6g70dudhq6l3mu0pr5juvv1ufl1ab445.apps.googleusercontent.com',
		},
	});

	if (!isAuthenticatedState && (!user || !user.data)) {
		if (!isLoading) {
			return (
				<Button
					type="primary"
					onClick={loginWithRedirect}
					css={css`
						position: fixed;
						top: 50%;
						/* margin: auto; */
						left: 50%;
						transform: translate(-50%, -50%);
					`}
					icon="login"
				>
					Other Login options
				</Button>
			);
		}
		return <Loader />;
	}

	if (isAuthenticatedState && (!user || !user.data)) {
		return <Loader />;
	}
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

import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';

import { Alert, Button, message } from 'antd';

import { css } from 'emotion';
import HelpChat from '../../components/HelpChat';
import Loader from '../../components/Loader';
import { injectAuthTokenHeaderIntoFetchGlobally } from '../../utils/helper';
import { createUserIfNew, getUser } from '../../utils';
import webAuth from '../../utils/WebAuthProxy';
import Flex from '../../batteries/components/shared/Flex';

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
function parseJwt(token) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(c => {
				return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
			})
			.join(''),
	);

	return JSON.parse(jsonPayload);
}

const PrivateRoute = ({
	component: Component,
	user,
	loadAppbaseUser,
	setAppbaseUser,
	setAppbaseUserError,
	fetchUserPlan,
	setApps,
	...rest
}) => {
	const {
		isAuthenticated,
		getAccessTokenSilently,
		isLoading,
		loginWithRedirect,
		getIdTokenClaims,
		logout,
	} = useAuth0();
	const [loadingState, setLoadingState] = useState(false);
	const [isAuthenticatedState, setIsAuthenticatedState] = useState(
		isAuthenticated,
	);
	const handleLogout = () => {
		window.localStorage.removeItem('AUTH_0_ACCESS_TOKEN');

		try {
			if (isAuthenticated) {
				logout({
					returnTo: window.location.origin,
				});
			} else {
				webAuth.logout({
					returnTo: window.location.origin,
				});
			}
		} catch (error) {
			console.log('Error logging out...', error);
		}
	};
	const authUsingEmail = emailParam => {
		if (!emailParam) return;
		try {
			setLoadingState(true);
			webAuth.authorize({
				connection: 'google-oauth2',
				login_hint: emailParam,
				responseType: 'token id_token',
			});
		} catch (error) {
			setLoadingState(false);
			console.log(error);
			message.error("Couldn't log you in!!!");
			setTimeout(() => {
				loginWithRedirect();
			}, 2000);
		}
	};

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
				accessToken = await getAccessTokenSilently({
					ignoreCache: true,
				}); // https://github.com/auth0/auth0-spa-js/issues/693#issuecomment-757125378
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

				const res = await getUser();
				if (res?.action?.email_verification) {
					setTimeout(() => {
						getAuth0AccessToken();
					}, 10000);
					if (res?.error) {
						setAppbaseUserError(res);
					}
					return;
				}

				const { user: userObj, apps } = res;
				setAppbaseUser(userObj);
				setApps(apps);
				fetchUserPlan();
			}
		} catch (error) {
			console.error('🚀 Error getting user from ACCAPI', error);
		}
	};

	useEffect(() => {
		if (isAuthenticated && !isAuthenticatedState)
			setIsAuthenticatedState(isAuthenticated);
	}, [isAuthenticated]);

	useEffect(() => {
		if (
			isAuthenticatedState &&
			!user.data &&
			!user.error?.actual?.action?.email_verification
		) {
			setLoadingState(false);
			getAuth0AccessToken();
		}
	}, [isAuthenticatedState]);

	useEffect(() => {
		if (window.location.hash) {
			const { access_token, email } = parseHash(window.location.hash);

			if (access_token) {
				if (!isAuthenticatedState) {
					setIsAuthenticatedState(true);
					return;
				}
			}
			if (email) {
				authUsingEmail(email);
			} else if (!isLoading && !loadingState && !isAuthenticatedState) {
				loginWithRedirect();
			}
			return;
		}
		if (!isLoading && !loadingState && !isAuthenticatedState) {
			loginWithRedirect();
		}
	}, []);

	const renderEmailVerificationMessage = () => {
		if (!user.error?.actual?.action?.email_verification) return null;
		return (
			<Alert
				message={
					<>
						An e-mail has been sent to &nbsp;
						<b>
							{
								parseJwt(
									window.localStorage.getItem(
										'AUTH_0_ACCESS_TOKEN',
									),
								)['https://reactivesearch.io-email']
							}
						</b>
						&nbsp; address for verification!
					</>
				}
				description={
					<>
						Once you&apos;ve verified, this page should auto-refresh
						within 30s 
						<Flex justifyContent="space-between">
							<Button
								css={`
									padding-left: 0;
								`}
								onClick={() => window.Intercom('show')}
								type="link"
							>
								Contact Support{' '}
							</Button>
							<Button
								css={`
									padding-left: 0;
									padding-right: 0;
								`}
								onClick={() => {
									handleLogout();
								}}
								type="link"
							>
								Go back to sign-up screen
							</Button>
						</Flex>
					</>
				}
				css={css`
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				`}
			/>
		);
	};

	if (!isAuthenticatedState && (!user || !user.data)) {
		return <Loader />;
	}
	if (isAuthenticatedState && (!user || !user.data)) {
		return !user.error?.actual?.action?.email_verification ? (
			<Loader />
		) : (
			renderEmailVerificationMessage()
		);
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
	setAppbaseUserError: PropTypes.func.isRequired,
	fetchUserPlan: PropTypes.func.isRequired,
	setApps: PropTypes.func.isRequired,
};

export default PrivateRoute;

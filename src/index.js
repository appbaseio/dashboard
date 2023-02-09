import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import { Layout } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';
import { Auth0Provider } from '@auth0/auth0-react';
import AnnouncementBanner from './AnnouncementBanner';
import configureStore from './store';
import Dashboard from './Dashboard';

import { mediaKey } from './utils/media';

import 'antd/dist/reset.css';

// global styles
// eslint-disable-next-line
injectGlobal`
* {
	box-sizing: border-box;
	font-family: 'Inter', sans-serif;
}
body {
	background-color: #fafafa !important;
}
h1, h2 {
	margin: 0 0 8px;
	line-height: 2.5rem;

	${mediaKey.medium} {
		line-height: 2.1rem;
	}
}
p {
	font-size: 16px;
	letter-spacing: 0.01rem;
	word-spacing: 0.05em;
	line-height: 26px;

	${mediaKey.medium} {
		font-size: 18px;
		line-height: 28px;
	}
}
`;

const { Content } = Layout;
const { store, persistor } = configureStore();

const App = () => {
	return (
		<Content>
			<PersistGate loading={null} persistor={persistor}>
				<Provider store={store}>
					<>
						<AnnouncementBanner />
						<Dashboard />
					</>
				</Provider>
			</PersistGate>
		</Content>
	);
};

ReactDOM.render(
	<Auth0Provider
		domain="reactivesearch-cloud.us.auth0.com"
		clientId="Qn5Kf234JXQ6rzvagKXtKv2uJ0LKEGHW"
		redirectUri={window.location.origin}
		audience="https://reactivesearch-cloud.us.auth0.com/api/v2/"
		scope="read:current_user update:current_user_metadata"
	>
		<App />
	</Auth0Provider>,
	document.getElementById('root'),
);

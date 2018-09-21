import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import { Layout } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './store';
import Dashboard from './Dashboard';

// global styles
// eslint-disable-next-line
injectGlobal`
* {
	box-sizing: border-box;
	font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif;
}
body {
	background-color: #fafafa !important;
}
h1, h2 {
	margin: 0 0 8px;
	font-weight: 700;
	line-height: 2.5rem;
}
p {
	font-size: 16px;
	letter-spacing: 0.01rem;
	word-spacing: 0.05em;
	line-height: 26px;
}
`;

const { Content } = Layout;
const { store, persistor } = configureStore();

const App = () => (
	<Content>
		<PersistGate loading={null} persistor={persistor}>
			<Provider store={store}>
				<Dashboard />
			</Provider>
		</PersistGate>
	</Content>
);

ReactDOM.render(<App />, document.getElementById('root'));

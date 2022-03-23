import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import { Layout } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './store';
import Dashboard from './Dashboard';

import { mediaKey } from './utils/media';

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

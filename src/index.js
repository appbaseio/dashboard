import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import { Layout } from 'antd';

import configureStore from './store';
import Dashboard from './Dashboard';

// global styles
// eslint-disable-next-line
injectGlobal`
* {
	box-sizing: border-box;
	font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif';
}
`;

const { Content } = Layout;
const store = configureStore();

const App = () => (
	<Content>
		<Provider store={store}>
			<Dashboard />
		</Provider>
	</Content>
);

ReactDOM.render(<App />, document.getElementById('root'));

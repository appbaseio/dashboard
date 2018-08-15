import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Layout } from 'antd';

import configureStore from './store';
import Loader from './components/Loader';

// routes
const Wrapper = Loadable({
	loader: () => import('./pages/Wrapper'),
	loading: Loader,
});

const { Content } = Layout;

// global styles
// eslint-disable-next-line
injectGlobal`
	* {
		box-sizing: border-box;
		font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif'
	}
`;

const store = configureStore();

const App = () => (
	<Content>
		<Provider store={store}>
			<Router>
				<Fragment>
					<Route component={Wrapper} />
				</Fragment>
			</Router>
		</Provider>
	</Content>
);

ReactDOM.render(<App />, document.getElementById('root'));

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Layout } from 'antd';

import configureStore from './store';
import Loader from './components/Loader';
import PrivateRoute from './pages/LoginPage/PrivateRoute';

// routes
const Wrapper = Loadable({
	loader: () => import('./pages/Wrapper'),
	loading: Loader,
});

const LoginPage = Loadable({
	loader: () => import('./pages/LoginPage'),
	loading: Loader,
});

const { Content } = Layout;

// global styles
// eslint-disable-next-line
injectGlobal`
	* {
		box-sizing: border-box;
		font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif';
	}
`;

const store = configureStore();

const App = () => (
	<Content>
		<Provider store={store}>
			<Router>
				<Fragment>
					<Route exact path="/login" component={LoginPage} />
					<PrivateRoute component={Wrapper} />
				</Fragment>
			</Router>
		</Provider>
	</Content>
);

ReactDOM.render(<App />, document.getElementById('root'));

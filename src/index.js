import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'emotion';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import configureStore from './store';

// routes
import Wrapper from './pages/Wrapper';

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
	<Provider store={store}>
		<Router>
			<Fragment>
				<Route component={Wrapper} />
			</Fragment>
		</Router>
	</Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

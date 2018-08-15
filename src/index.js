import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import configureStore from './store';

const store = configureStore();
const App = () => (
	<Provider store={store}>
		<div>Hello</div>
	</Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

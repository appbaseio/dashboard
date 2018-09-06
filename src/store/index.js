import {
 createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import batteriesReducers from '../batteries/modules/reducers';

import rootSaga from '../sagas';

import rootReducer from '../reducers';

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = applyMiddleware(...[sagaMiddleware, thunkMiddleware]);
	const store = createStore(
		combineReducers({ ...rootReducer, ...batteriesReducers }),
		window.__REDUX_DEVTOOLS_EXTENSION__
			? compose(
					middlewares,
					window.__REDUX_DEVTOOLS_EXTENSION__(),
			  ) // eslint-disable-line
			: middlewares,
	);
	sagaMiddleware.run(rootSaga);
	return store;
};

export default configureStore;

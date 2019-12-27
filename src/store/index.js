import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootSaga from '../sagas';
import batteriesReducers from '../batteries/modules/reducers';
import rootReducer from '../reducers';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['$getCurrentApp'],
};

const allReducers = {
	...rootReducer,
	...batteriesReducers,
};
const persistedReducer = persistCombineReducers(persistConfig, allReducers);

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = applyMiddleware(...[sagaMiddleware, thunkMiddleware]);
	const store = createStore(
		persistedReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__
			? compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__()) // eslint-disable-line
			: middlewares,
	);
	const persistor = persistStore(store);
	sagaMiddleware.run(rootSaga);
	return { store, persistor };
};

export default configureStore;

import { combineReducers } from 'redux';

import userReducer from './userReducer';
import appsReducer from './appsReducer';

const rootReducer = combineReducers({
	user: userReducer,
	apps: appsReducer,
});

export default rootReducer;

import { combineReducers } from 'redux';

import userReducer from './userReducer';
import appsReducer from './appsReducer';
import appsMetricsReducer from './appsMetricsReducer';

const rootReducer = combineReducers({
	user: userReducer,
	apps: appsReducer,
	appsMetrics: appsMetricsReducer,
});

export default rootReducer;

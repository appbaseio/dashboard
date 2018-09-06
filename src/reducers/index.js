import userReducer from './userReducer';
import appsReducer from './appsReducer';
import appsMetricsReducer from './appsMetricsReducer';

export default {
	user: userReducer,
	apps: appsReducer,
	appsMetrics: appsMetricsReducer,
};

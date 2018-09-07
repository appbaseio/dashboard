import userReducer from './userReducer';
import appsReducer from './appsReducer';
import createAppReducer from './createAppReducer';
import appsMetricsReducer from './appsMetricsReducer';

export default {
	user: userReducer,
	apps: appsReducer,
	appsMetrics: appsMetricsReducer,
	createdApp: createAppReducer,
};

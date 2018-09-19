import userReducer from './userReducer';
import appsReducer from './appsReducer';
import appsMetricsReducer from './appsMetricsReducer';
import appsOwnersReducer from './appsOwnersReducer';
import createAppReducer from './createAppReducer';

export default {
	user: userReducer,
	apps: appsReducer,
	appsMetrics: appsMetricsReducer,
	appsOwners: appsOwnersReducer,
	createdApp: createAppReducer,
};

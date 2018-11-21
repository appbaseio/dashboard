import userReducer from './userReducer';
import appsReducer from './appsReducer';
import appsMetricsReducer from './appsMetricsReducer';
import appsOverviewReducer from './appsOverviewReducer';
import appsOwnersReducer from './appsOwnersReducer';
import createAppReducer from './createAppReducer';

export default {
	user: userReducer,
	apps: appsReducer,
	appsMetrics: appsMetricsReducer,
	appsOverview: appsOverviewReducer,
	appsOwners: appsOwnersReducer,
	createdApp: createAppReducer,
};

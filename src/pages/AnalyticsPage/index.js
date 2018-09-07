import React from 'react';
import get from 'lodash/get';
import Analytics from '../../batteries/components/analytics';

const AnalyticsView = (props) => {
	const appName = get(props, 'match.params.appName');
	const tab = get(props, 'match.params.tab');
	const subTab = get(props, 'match.params.subTab');
	return <Analytics appName={appName} tab={tab} subTab={subTab} />;
};

export default AnalyticsView;

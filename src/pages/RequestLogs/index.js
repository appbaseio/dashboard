import React from 'react';
import get from 'lodash/get';
import RequestLogs from '../../batteries/components/analytics/components/RequestLogs';

export default (props) => {
	const appName = get(props, 'match.params.appname');
	const activeTab = get(props, 'match.params.tab');
	return (
		<RequestLogs
			appName={appName}
			tab={activeTab}
			onTabChange={(tab) => {
				window.history.pushState(
					null,
					null,
					`${window.location.origin}/app/${appName}/request-logs/${tab}`,
				);
			}}
		/>
	);
};

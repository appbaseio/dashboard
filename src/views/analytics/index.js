import React from 'react';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';
import Analytics from './../../../modules/batteries/components/analytics';

const AnalyticsView = (props) => {
	const pageInfo = {
		currentView: 'analytics',
		appName: props.params.appId,
		appId: appbaseService.userInfo.body.apps[props.params.appId],
	};
	return (
		<AppPage pageInfo={pageInfo} key={pageInfo.appId}>
			<Analytics
				appName={pageInfo.appName}
				activeTab={props.params.tab}
				activeSubTab={props.params.subTab}
			/>
		</AppPage>
	);
};

export default AnalyticsView;

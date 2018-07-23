import React from 'react';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';

export default (props) => {
	const appName = props.params.appId;
	const appId = appbaseService.userInfo.body.apps[appName];
	const pageInfo = {
		currentView: 'mappings',
		appName,
		appId,
	};

	return (
		<AppPage pageInfo={pageInfo} key={appId}>
			<div className="ad-detail-page ad-dashboard row" style={{ padding: '40px 0' }}>
				<h2>Welcome to analytics</h2>
			</div>
		</AppPage>
	);
};

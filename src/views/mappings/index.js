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
		<AppPage pageInfo={pageInfo}>
			<div className="ad-detail-page ad-dashboard row" style={{ padding: '40px 0' }}>
				{
					React.Children.map(props.children, child =>
						React.cloneElement(child, { appId, appName }))
				}
			</div>
		</AppPage>
	);
};

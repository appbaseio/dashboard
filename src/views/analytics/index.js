import React from 'react';
import { Card, Tabs } from 'antd';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';
import Flex from './../../shared/Flex';
import Searches from './components/Searches';

const { TabPane } = Tabs;

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
			<div className="ad-detail-page ad-dashboard row" style={{ padding: '40px' }}>
				<Tabs defaultActiveKey="1">
					<TabPane tab="Analytics" key="1">
						<Card title="Daily Search Volume" />
						<Flex css="width: 100%;margin-top: 20px">
							<div css="flex: 50%;margin-right: 10px">
								<Searches title="Popular Searches" />
							</div>
							<div css="flex: 50%;margin-left: 10px">
								<Searches title="No Result Searches" />
							</div>
						</Flex>
					</TabPane>
					<TabPane tab="Popular Searches" key="2">
						Content of Tab Pane 2
					</TabPane>
					<TabPane tab="No Result Searches" key="3">
						Content of Tab Pane 3
					</TabPane>
				</Tabs>
			</div>
		</AppPage>
	);
};

import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, Card } from 'antd';
import { getDeployedCluster } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const logs = [
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text: '@all:',
		timestamp: '2022-04-13T19:53:48.350376175Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text: '  |--@ungrouped:',
		timestamp: '2022-04-13T19:53:48.350381389Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text: '  |  |--34.122.134.213',
		timestamp: '2022-04-13T19:53:48.350450229Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text: '',
		timestamp: '2022-04-13T19:53:48.350452274Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text:
			'PLAY [manage kibana deployment] ************************************************',
		timestamp: '2022-04-13T19:53:48.350473585Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text: '',
		timestamp: '2022-04-13T19:53:48.350475407Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text:
			'TASK [Gathering Facts] *********************************************************',
		timestamp: '2022-04-13T19:53:48.350506051Z',
	},
	{
		cluster_id: 'appbase-demo-new-udhuzdz',
		level: 'INFO',
		text:
			'Tuesday 12 April 2022  13:49:35 +0000 (0:00:00.053)       0:00:00.053 ********* ',
		timestamp: '2022-04-13T19:53:48.350588718Z',
	},
];

const DeployLogs = ({ clusterId }) => {
	useEffect(() => {
		// getDeployedCluster('appbase-demo-new-udhuzdz')
		// 	.then(async res => await res.text())
		// 	.then(res => console.log(res))
		// 	.catch(err => console.error(err));
	}, []);

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						<div>Time Taken: ==time== </div>
						<Button type="primary" ghost>
							View Cluster Details
						</Button>
					</div>
				}
			>
				<Editor
					height="90vh"
					defaultLanguage="javascript"
					options={{ readOnly: true }}
					// defaultValue={logs.forEach(data => {
					// 	<div style={{ display: 'flex' }}>
					// 		{data.level}&nbsp;{data.timestamp}&nbsp;{data.text}
					// 	</div>;
					// })}
					defaultValue="level Timestamp content"
				/>
			</Card>
		</div>
	);
};

export default DeployLogs;

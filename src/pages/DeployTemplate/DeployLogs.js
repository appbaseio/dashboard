import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getDeployedCluster } from '../ClusterPage/utils';

const DeployLogs = ({ clusterId }) => {
	console.log(clusterId);
	useEffect(() => {
		getDeployedCluster(clusterId)
			.then(res => console.log(res))
			.catch(err => console.error(err));
	}, []);

	return <div>deploy logs</div>;
};

export default DeployLogs;

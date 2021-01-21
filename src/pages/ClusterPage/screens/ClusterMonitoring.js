import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import MonitoringContainer from '../../../batteries/components/Monitoring/MonitoringContainer';

const ClusterMonitoring = ({ deployments, plan }) => {
	const arcDetails = get(deployments, 'addons').find(i => i.name === 'arc');
	const elasticsearchDetails = get(deployments, 'elasticsearch');
	const kibanaDetails = get(deployments, 'kibana');

	const monitoringProps = {
		plan,
		esURL: get(elasticsearchDetails, 'url', '').replace(/\/$/, ''),
		esUsername: get(elasticsearchDetails, 'username'),
		esPassword: get(elasticsearchDetails, 'password'),
		arcURL: get(arcDetails, 'url', '').replace(/\/$/, ''),
		kibanaURL: get(kibanaDetails, 'url', '').replace(/\/$/, ''),
		kibanaUsername: get(kibanaDetails, 'username', null),
		kibanaPassword: get(kibanaDetails, 'password', null),
	};
	return (
		<div>
			<MonitoringContainer {...monitoringProps} />
		</div>
	);
};

ClusterMonitoring.propTypes = {
	deployments: PropTypes.object.isRequired,
	plan: PropTypes.string.isRequired,
};

export default ClusterMonitoring;

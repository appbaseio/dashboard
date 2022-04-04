import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import NewMyCluster from '../ClusterPage/new';

const DeployCluster = ({ formData }) => {
	console.log(formData);
	return (
		<div>
			<NewMyCluster isDeployTemplate pipeline={formData.id} />
		</div>
	);
};

DeployCluster.defaultProps = {
	formData: {},
};

DeployCluster.propTypes = {
	formData: PropTypes.object,
};

export default DeployCluster;
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import NewMyCluster from '../ClusterPage/NewMyCluster';

const DeployCluster = ({ formData }) => {
	return (
		<div>
			<NewMyCluster
				isDeployTemplate
				pipeline={formData.id}
				location={location}
			/>
		</div>
	);
};

DeployCluster.defaultProps = {
	formData: {},
};

DeployCluster.propTypes = {
	formData: PropTypes.object,
	location: PropTypes.object.isRequired,
};

export default DeployCluster;

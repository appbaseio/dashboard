import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import NewMyCluster from '../ClusterPage/NewMyCluster';
import { getClusters } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const DeployCluster = ({ formData }) => {
	const [activeClusters, setActiveClusters] = useState([]);
	const [selectedCluster, setSelectedCluster] = useState('');
	const [nextPage, setNextPage] = useState(false);

	useEffect(() => {
		getClusters()
			.then(clusters => {
				const avaibleActiveClusters = clusters.filter(
					cluster => cluster.status === 'active',
				);
				setActiveClusters(avaibleActiveClusters);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	return (
		<div css={deployClusterStyles}>
			{!activeClusters.length || nextPage ? (
				<NewMyCluster
					isDeployTemplate
					pipeline={formData.id}
					location={location}
				/>
			) : (
				<div style={{ padding: 20 }}>
					<h3>
						Looks like you already have an active cluster. Choose
						your cluster from the dropdown below or proceed to
						create a new cluster.{' '}
					</h3>
					<div style={{ position: 'relative', height: 200 }}>
						<div>Choose Cluster</div>
						<Select
							allowClear
							className="input-container"
							value={selectedCluster}
							onChange={val => {
								console.log(val);
								setSelectedCluster(val);
								// Check if value is empty
							}}
						>
							{activeClusters.map(data => (
								<Select.Option key={data.id}>
									{data.name}
								</Select.Option>
							))}
						</Select>
						<Button
							block
							size="small"
							type="primary"
							className="create-cluster-button"
							style={{ display: 'block' }}
							disabled={selectedCluster}
							onClick={setNextPage(true)}
						>
							Create a new Reactivesearch cluster
						</Button>
						<Button
							block
							size="small"
							type="primary"
							className="deploy-button"
							style={{
								position: 'absolute',
								right: 0,
								bottom: 0,
							}}
							disabled={!selectedCluster}
							onClick={() => {
								// deployment
							}}
						>
							Next
						</Button>
					</div>
				</div>
			)}
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

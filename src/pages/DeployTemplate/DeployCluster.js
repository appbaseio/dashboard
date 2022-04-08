import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Icon } from 'antd';
import NewMyCluster from '../ClusterPage/NewMyCluster';
import { getClusters, getClusterData } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';
import Loader from '../../components/Loader';

const DeployCluster = ({ formData, location }) => {
	const [activeClusters, setActiveClusters] = useState([]);
	const [selectedCluster, setSelectedCluster] = useState({});
	const [nextPage, setNextPage] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [iconType, setIconType] = useState('');

	useEffect(() => {
		getClusters()
			.then(clusters => {
				const avaibleActiveClusters = clusters.filter(
					cluster => cluster.status === 'active',
				);
				setActiveClusters(avaibleActiveClusters);
				setIsLoading(false);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	function createPipeline() {
		getClusterData(selectedCluster.id).then(res => {
			const { url, username, password } =
				res?.deployment?.addons[0] || '';
			const dataUrl = location.search.split('=')[1];
			const obj = {
				method: 'POST',
				headers: {
					Authorization: `Basic ${btoa(`${username}:${password}`)}`,
				},
				body: JSON.stringify({
					pipeline: localStorage.getItem(dataUrl),
					extension: 'json',
				}),
			};
			fetch(`${url}_pipeline`, obj)
				.then(response => response.json())
				.then(json => {
					setIconType('check-circle');
					console.log(json);
				})
				.catch(err => {
					setIconType('');
					console.error(err);
				});
		});
	}

	if (isLoading) return <Loader />;

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
							onChange={val => {
								if (!val) setSelectedCluster({});
							}}
						>
							{activeClusters.map(data => (
								<Select.Option key={data.id}>
									<div
										onClick={() => setSelectedCluster(data)}
									>
										{data.name}
									</div>
								</Select.Option>
							))}
						</Select>
						<Button
							block
							size="small"
							type="primary"
							className="create-cluster-button"
							style={{ display: 'block' }}
							disabled={selectedCluster.id}
							onClick={() => setNextPage(true)}
						>
							<Icon type="plus" />
							Create a new Reactivesearch cluster
						</Button>
						<Button
							block
							size="small"
							type="primary"
							className="deploy-button"
							style={{
								width: 'auto',
								position: 'absolute',
								right: 0,
								bottom: 0,
							}}
							disabled={!selectedCluster.id}
							onClick={() => {
								setIconType('loading');
								createPipeline();
							}}
						>
							Deploy pipeline {formData.id} to&nbsp;
							{selectedCluster.name} cluster
							{iconType ? (
								<Icon
									type={iconType}
									style={{ color: 'green' }}
								/>
							) : null}
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

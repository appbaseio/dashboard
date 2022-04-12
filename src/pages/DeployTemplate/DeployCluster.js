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
			const formData = new FormData();

			formData.append(
				'pipeline',
				JSON.stringify({
					content: localStorage.getItem(dataUrl) || '{}',
					extension: 'json',
				}),
			);
			const obj = {
				method: 'POST',
				headers: {
					Authorization: `Basic ${btoa(`${username}:${password}`)}`,
				},
				body: formData,
			};
			fetch(`${url}_pipeline`, obj)
				.then(response => response.json())
				.then(json => {
					console.log(json);
					if (json.error) {
						setIconType('close-circle');
					} else {
						setIconType('check-circle');
					}
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
						<div className="deploy-cluster-option-chooser">
							<div className="choose-cluster">
								<div>Choose Cluster</div>
								<Select
									allowClear
									className="dropdown-container"
									onChange={val => {
										if (!val) setSelectedCluster({});
									}}
								>
									{activeClusters.map(data => (
										<Select.Option key={data.id}>
											<div
												onClick={() =>
													setSelectedCluster(data)
												}
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
									className="deploy-button"
									style={{
										width: 'auto',
										margin: '20px 0px 0px 0px',
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
											style={{
												color:
													iconType === 'close-circle'
														? 'red'
														: 'green',
											}}
										/>
									) : null}
								</Button>
							</div>
							<div>OR</div>
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
						</div>
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Select, Icon, Alert } from 'antd';
import NewMyCluster from '../ClusterPage/NewMyCluster';
import { getClusters, getClusterData } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';
import Loader from '../../components/Loader';

const DeployCluster = ({
	formData,
	location,
	setActiveKey,
	setTabsValidated,
	setClusterId,
}) => {
	const [activeClusters, setActiveClusters] = useState([]);
	const [selectedCluster, setSelectedCluster] = useState({});
	const [nextPage, setNextPage] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [iconType, setIconType] = useState('');
	const [deploymentMessage, setDeploymentMessage] = useState('');

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
		getClusterData(selectedCluster.id)
			.then(res => {
				const { url, username, password } =
					res?.deployment?.addons[0] || '';
				const dataUrl = location.search.split('=')[1];
				const newDeployTemplateData = {
					...JSON.parse(localStorage.getItem(dataUrl)),
				};
				const formData = new FormData();

				formData.append(
					'pipeline',
					JSON.stringify({
						content: newDeployTemplateData.formData || '{}',
						extension: 'json',
					}),
				);
				const obj = {
					method: 'POST',
					headers: {
						Authorization: `Basic ${btoa(
							`${username}:${password}`,
						)}`,
					},
					body: formData,
				};
				fetch(`${url}_pipeline`, obj)
					.then(response => response.json())
					.then(json => {
						if (json?.error) {
							setIconType('close-circle');
							if (!json.error?.message)
								setDeploymentMessage(json.error);
							else setDeploymentMessage(json.error);
						} else {
							setIconType('check-circle');
							setDeploymentMessage('success');
						}
					})
					.catch(err => {
						setIconType('close-circle');
						console.error('Error in deploy api', err);
						if (err?.message) setDeploymentMessage(err?.message);
					});
			})
			.catch(err => {
				setIconType('close-circle');
				if (!err?.message) setDeploymentMessage(err);
				else setDeploymentMessage(err.message);
			});
	}

	const getErrorMessage = error => {};
	if (isLoading) return <Loader />;

	return (
		<div css={deployClusterStyles}>
			{!activeClusters.length || nextPage ? (
				<NewMyCluster
					isDeployTemplate
					pipeline={formData.id}
					location={location}
					setActiveKey={setActiveKey}
					setTabsValidated={setTabsValidated}
					setClusterId={setClusterId}
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
										<Select.Option
											key={data.id}
											onClick={() =>
												setSelectedCluster(data)
											}
										>
											<div>{data.name}</div>
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
					{deploymentMessage ? (
						deploymentMessage === 'success' ? (
							<Alert
								type="info"
								message={
									<div className="success-alert">
										<div>
											Pipeline is successfully deployed on
											the {selectedCluster.name} cluster
										</div>
										<Button
											type="primary"
											// size="small"
											ghost
											className="cluster-view-button"
											onClick={() =>
												history.push(
													`/clusters/${selectedCluster.id}`,
												)
											}
										>
											Go to {selectedCluster.name}{' '}
											cluster's view ↗
										</Button>
									</div>
								}
							/>
						) : (
							<Alert
								type="error"
								message={
									<div>
										{JSON.stringify(
											deploymentMessage,
											null,
											4,
										) !== '{}'
											? JSON.stringify(
													deploymentMessage,
													null,
													4,
											  )
											: `{ error: Failed to fetch }`}
									</div>
								}
							/>
						)
					) : null}
				</div>
			)}
		</div>
	);
};

DeployCluster.defaultProps = {
	formData: {},
	setClusterId: () => {},
};

DeployCluster.propTypes = {
	formData: PropTypes.object,
	location: PropTypes.object.isRequired,
	setClusterId: PropTypes.func,
};

export default withRouter(DeployCluster);

/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Button, Select, Alert } from 'antd';
import { getClusters, getClusterData } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';
import Loader from '../../components/Loader';
import NewMyServerlessSearch from '../ClusterPage/NewMyServerlessSearch';

const iconMap = {
	'close-circle': <CloseCircleOutlined style={{ color: 'red' }} />,
	'check-circle': <CheckCircleOutlined style={{ color: 'green' }} />,
	loading: <LoadingOutlined />,
};

const DeployCluster = ({ formData, location, setActiveKey, setClusterId }) => {
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
				const dataUrl = location.search
					.split('=')[1]
					.replace('https://raw.githubusercontent.com/', '');
				const newDeployTemplateData = {
					...JSON.parse(localStorage.getItem(dataUrl)),
				};
				const formDataVar = new FormData();

				formDataVar.append(
					'pipeline',
					JSON.stringify({
						content:
							JSON.stringify(newDeployTemplateData.formData) ||
							'{}',
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
					body: formDataVar,
				};

				const sanitisedURL = url.endsWith('/')
					? `${url}_pipeline`
					: `${url}/_pipeline`;
				fetch(sanitisedURL, obj)
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

	if (isLoading) return <Loader />;

	return (
		<div css={deployClusterStyles}>
			{!activeClusters.length || nextPage ? (
				deploymentMessage ? (
					deploymentMessage === 'success' ? (
						<Alert
							type="info"
							message={
								<div className="success-alert">
									<div>
										Pipeline is successfully deployed on the{' '}
										{selectedCluster.clusterName} cluster
									</div>
									<Button
										type="primary"
										// size="small"
										ghost
										className="cluster-view-button"
										onClick={() =>
											window.open(
												`${window.location.origin}/clusters/${selectedCluster.clusterId}`,
												'_blank',
											)
										}
									>
										Go to {selectedCluster.clusterName}{' '}
										cluster&apos;s view ↗
									</Button>
								</div>
							}
						/>
					) : null
				) : (
					<NewMyServerlessSearch
						isDeployTemplate
						pipeline={formData.id}
						location={location}
						setActiveKey={setActiveKey}
						setTabsValidated={clusterInfo => {
							setDeploymentMessage('success');
							setSelectedCluster(clusterInfo);
						}}
						setClusterId={setClusterId}
					/>
				)
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
									Deploy pipeline {formData.id}&nbsp;to&nbsp;
									{selectedCluster.name} cluster
									{iconType ? iconMap[iconType] : null}
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
								<PlusOutlined />
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
												window.open(
													`${window.location.origin}/clusters/${selectedCluster.id}`,
													'_blank',
												)
											}
										>
											Go to {selectedCluster.name}{' '}
											cluster&apos;s view ↗
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
	setActiveKey: PropTypes.func,
};

export default withRouter(DeployCluster);

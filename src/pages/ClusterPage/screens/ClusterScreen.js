/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/alt-text */
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Button, message, notification, Select, Tag } from 'antd';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import get from 'lodash/get';
import ArcDetail from '../components/ArcDetail';
import CredentialsBox from '../components/CredentialsBox';
import StripeCheckout from '../../../components/StripeCheckout';
import {
	card,
	clusterButtons,
	clusterEndpoint,
	esContainer,
	fadeOutStyles,
	settingsItem,
} from '../styles';
import {
	getClusters,
	getSnapshots,
	hasAddon,
	restore,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	rotateAPICredentials,
	BACKENDS,
	capitalizeWord,
	verifyCluster,
	updateBackend,
	arc as arc_version,
} from '../utils';
import { machineMarks } from '../NewMyServerlessSearch';

const { Option } = Select;
const BLACK_LISTED_BACKENDS = [];

class ClusterScreen extends Component {
	constructor(props) {
		super(props);

		let visualization = 'none';

		switch (true) {
			case props.kibana:
				visualization = 'kibana';
				break;
			case props.grafana:
				visualization = 'grafana';
				break;
			default:
				visualization = 'none';
		}
		this.state = {
			cluster: props.cluster,
			arc: props.arc,
			deployment: props.deployment,
			kibana: props.kibana,
			streams: props.streams,
			elasticsearchHQ: props.elasticsearchHQ,
			clusters: [],
			isClusterLoading: true,
			snapshots: [],
			isSnapshotsLoading: false,
			restore_from: null,
			snapshot_id: null,
			repository_name: null,
			isRestoring: false,
			visualization,
			isStripeCheckoutOpen: false,
			setSearchEngine: false,
			backend: BACKENDS.ELASTICSEARCH.name,
			verifiedCluster: false,
			clusterVersion: '',
			verifyingURL: false,
			clusterURL: '',
			isInvalidURL: false,
			urlErrorMessage: '',
		};

		this.paymentButton = React.createRef();
		this.paymentTriggered = false;
	}

	componentDidMount() {
		this.triggerPayment();
		this.initClusters();
		this.setState({
			backend: this.props.cluster?.backend,
		});
	}

	initClusters = () => {
		getClusters()
			.then(clusters => {
				const activeClusters = clusters.filter(
					item => item.status === 'active' && item.role === 'admin',
				);

				const backendVal = clusters.find(
					_ => _.id === this.props.clusterId,
				).backend;

				this.setState({
					clustersAvailable: !!clusters.length,
					clusters: activeClusters,
					isClusterLoading: false,
					...(backendVal ? { backend: backendVal } : {}),
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isClusterLoading: false,
				});
			});
	};

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	handleCluster = value => {
		this.setState({
			restore_from: value,
			snapshots: [],
		});
		this.fetchClusterSnapshots(value);
	};

	handleSnapshot = value => {
		const split = value.split(`___`);
		this.setState({
			snapshot_id: split[0],
			repository_name: split[1],
		});
	};

	fetchClusterSnapshots = restoreFrom => {
		this.setState({
			isSnapshotsLoading: true,
		});
		getSnapshots(restoreFrom)
			.then(snapshots => {
				this.setState({
					snapshotsAvailable: !!snapshots.length,
					snapshots,
					isSnapshotsLoading: false,
				});
				if (!snapshots.length) {
					message.info(`No snapshots found`);
				}
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isSnapshotsLoading: false,
				});
			});
	};

	restoreCluster = () => {
		const { restore_from, snapshot_id, repository_name } = this.state;
		const { clusterId } = this.props;

		this.setState({
			isRestoring: true,
		});

		restore(clusterId, restore_from, snapshot_id, repository_name)
			.then(response => {
				if (response.status.code >= 400) {
					notification.error({
						message: 'Restoration Failed!',
						description: get(response, 'status.message'),
					});
				} else {
					message.success(get(response, 'status.message'));
				}
				this.setState({
					isRestoring: false,
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isRestoring: false,
				});
			});
	};

	toggleConfig = type => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	includedInOriginal = key => {
		const { deployment: original } = this.props;
		return get(original, key)
			? !!Object.keys(get(original, key)).length
			: hasAddon(key, original);
	};

	saveClusterSettings = () => {
		const body = {
			remove_deployments: [],
		};

		const {
			cluster,
			arc,
			kibana,
			grafana,
			streams,
			elasticsearchHQ // prettier-ignore
		} = this.state;

		const { clusterId, onDeploy, isSLSCluster } = this.props;

		if (!isSLSCluster) {
			if (kibana && !this.includedInOriginal('kibana')) {
				body.kibana = {
					create_node: false,
					version: cluster.es_version,
				};
			} else if (!kibana && this.includedInOriginal('kibana')) {
				body.remove_deployments = [
					...body.remove_deployments,
					'kibana',
				];
			}

			if (grafana && !this.includedInOriginal('grafana')) {
				body.grafana = true;
			} else if (!grafana && this.includedInOriginal('grafana')) {
				body.remove_deployments = [
					...body.remove_deployments,
					'grafana',
				];
			}

			if (streams && !this.includedInOriginal('streams')) {
				body.addons = body.addons || [];
				body.addons = [
					...body.addons,
					{
						name: 'streams',
						image: 'appbaseio/streams:6',
						exposed_port: 80,
					},
				];
			} else if (!streams && this.includedInOriginal('streams')) {
				body.remove_deployments = [
					...body.remove_deployments,
					'streams',
				];
			}

			if (arc && !this.includedInOriginal('arc')) {
				body.addons = body.addons || [];
				body.addons = [
					...body.addons,
					{
						name: 'arc',
						image: `siddharthlatest/arc:${arc_version}-cluster`,
						exposed_port: 8000,
					},
				];
			} else if (!arc && this.includedInOriginal('arc')) {
				body.remove_deployments = [...body.remove_deployments, 'arc'];
			}

			if (
				elasticsearchHQ &&
				!this.includedInOriginal('elasticsearch-hq')
			) {
				body.addons = body.addons || [];
				body.addons = [
					...body.addons,
					{
						name: 'elasticsearch-hq',
						image: 'elastichq/elasticsearch-hq:release-v3.5.0',
						exposed_port: 5000,
					},
				];
			} else if (
				!elasticsearchHQ &&
				this.includedInOriginal('elasticsearch-hq')
			) {
				body.remove_deployments = [
					...body.remove_deployments,
					'elasticsearch-hq',
				];
			}
			onDeploy(body, clusterId);
		} else {
			if (!this.state.backend) {
				message.error('Choose a backend');
				return;
			}
			let updateBackendPayload = { backend: this.state.backend };
			if (this.state.backend !== BACKENDS.System.name) {
				const {
					protocol,
					username: backendUrlUsername,
					password: backendUrlPassword,
					host,
				} = new URL(this.state.clusterURL);

				if (!this.state.verifiedCluster) {
					message.error('Cluster URL not verified');
					return;
				}

				updateBackendPayload = {
					...updateBackendPayload,
					host,
					protocol: protocol.substr(0, protocol.length - 1),
					basic_auth: `${backendUrlUsername}:${backendUrlPassword}`,
				};
			}
			updateBackend(clusterId, updateBackendPayload)
				.then(() => {
					notification.success({
						message: 'Backend updated successfully',
					});

					this.setState({
						loading: false,
					});
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch(e => {
					notification.error({
						title: 'Error while updating backend',
						description: e.message,
					});
					this.setState({
						loading: false,
					});
				});
		}
	};

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleStripeSubmit = data => {
		this.setState({
			isStripeCheckoutOpen: false,
		});
		this.props.handleToken(data);
	};

	handleVerify = async () => {
		const { clusterURL, backend } = this.state;
		if (clusterURL) {
			this.setState({
				verifyingURL: true,
				verifiedCluster: false,
				clusterVersion: '',
			});
			verifyCluster(clusterURL, backend)
				.then(data => {
					const version = get(data, 'version.number', '');
					this.setState({
						verifyingURL: false,
						clusterVersion: version || 'N/A',
						isInvalidURL: false,
						verifiedCluster: true,
					});
				})
				.catch(e => {
					this.setState({
						verifyingURL: false,
						isInvalidURL: true,
						verifiedCluster: false,
						urlErrorMessage: e.toString(),
					});
				});
		} else {
			this.setState({
				isInvalidURL: true,
				urlErrorMessage: 'Please enter a valid URL to verify',
			});
		}
	};

	renderClusterEndpoint = (source, isOpenSearchFlavour) => {
		const { isSLSCluster } = this.props;
		if (
			Object.keys(source).length &&
			source.name &&
			source.name !== 'gateway' &&
			source.name !== 'elasticsearch-hq'
		) {
			const username = source.username || source.dashboard_username;
			const password = source.password || source.dashboard_password;
			const [protocol, url] = (source.url || source.dashboard_url).split(
				'://',
			);
			// Kibana frowns on use of username/password in URL, hence we copy URL without them
			const copyURL =
				source.name === 'kibana' ||
				source.name === 'OpenSearch Dashboard'
					? `${protocol}://${url}`
					: `${protocol}://${username}:${password}@${url}`.replace(
							/\/$/,
							'',
					  );
			let { name } = source;
			const { cluster } = this.state;
			const isViewer = cluster.user_role === 'viewer';

			if (name === 'arc' || name === 'sls') {
				name = 'Reactivesearch.io';
			}
			if (name === 'elasticsearch') {
				name = isOpenSearchFlavour ? 'OpenSearch' : 'Elasticsearch';
			}
			return (
				<div key={name} className={clusterEndpoint}>
					<h4>
						{name}
						<CopyToClipboard
							text={copyURL}
							onCopy={() =>
								notification.success({
									message: ` ${name} URL copied successfully`,
								})
							}
						>
							<span
								data-clipboard-text={copyURL}
								style={{
									color: 'dodgerblue',
									cursor: 'pointer',
								}}
							>
								Copy URL
							</span>
						</CopyToClipboard>
					</h4>
					<CredentialsBox
						name={name}
						text={`${username}:${password}`}
						rotateAPICredentials={(type, clusterId) =>
							rotateAPICredentials(type, clusterId, isSLSCluster)
						}
						clusterId={this.props.clusterId}
						showRotateAPICredentials={!isViewer}
					/>
				</div>
			);
		}

		return null;
	};

	triggerPayment = () => {
		if (
			!this.paymentTriggered &&
			window.location.search.startsWith('?subscribe=true')
		) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
				this.paymentTriggered = true;
			}
		}
	};

	render() {
		const {
			cluster,
			deployment,
			isStripeCheckoutOpen,
			verifiedCluster,
			clusterVersion,
			setSearchEngine,
			isInvalidURL,
			clusterURL,
			verifyingURL,
			urlErrorMessage,
		} = this.state;
		const isOpenSearchFlavour =
			Number(this.state.cluster.es_version.split('.')[0]) < 7;
		const {
			clusterId,
			isPaid,
			isSLSCluster,
			handleDeleteModal,
			isExternalCluster,
		} = this.props;
		const isViewer = cluster.user_role === 'viewer';

		let addons = deployment.addons || [];

		addons = addons.filter(i => (i.name === isSLSCluster ? 'sls' : 'arc'));
		if (isExternalCluster) {
			const arcDeployment =
				deployment &&
				deployment.addons &&
				deployment.addons.find(addon => addon.name === 'arc');
			return (
				<Fragment>
					<ArcDetail
						cluster={cluster}
						arc={arcDeployment}
						handleDeleteModal={handleDeleteModal}
					/>
					{isStripeCheckoutOpen && (
						<StripeCheckout
							visible={isStripeCheckoutOpen}
							plan={PLAN_LABEL[cluster.pricing_plan]}
							price={EFFECTIVE_PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							monthlyPrice={PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							onCancel={this.handleStripeModal}
							onSubmit={data =>
								this.handleStripeSubmit({ clusterId, ...data })
							}
						/>
					)}
					<div className={clusterButtons}>
						<div>
							{!isPaid &&
							window.location.search.startsWith(
								'?subscribe=true',
							) ? (
								<Button
									size="large"
									css={{
										marginRight: 12,
									}}
									ref={this.paymentButton}
									onClick={this.handleStripeModal}
								>
									Pay now
								</Button>
							) : null}
						</div>
					</div>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{!isSLSCluster ? (
					<li className={card}>
						<div className="col light">
							<h3>
								{isOpenSearchFlavour
									? 'OpenSearch'
									: 'Elasticsearch'}
							</h3>
							<p>Live cluster endpoint</p>
						</div>

						<div className="col">
							{Object.keys(deployment)
								.filter(item => item !== 'addons')
								.map(key =>
									this.renderClusterEndpoint(
										deployment[key],
										isOpenSearchFlavour,
									),
								)}
						</div>
					</li>
				) : null}

				<li className={card}>
					<div className="col light">
						<h3>Reactivesearch.io Server</h3>
						<a
							href="https://docs.reactivesearch.io/docs/hosting/clusters/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Learn more
						</a>
					</div>

					<div className="col">
						{addons.map(key => this.renderClusterEndpoint(key))}
					</div>
				</li>

				{!isSLSCluster ? (
					<li className={card}>
						<div className="col light">
							<h3>Choose Visualization Tool</h3>
						</div>

						<div
							className={settingsItem}
							css={{
								padding: 30,
								alignItems: 'baseline',
							}}
						>
							<div className={esContainer}>
								<Button
									type={
										this.state.visualization === 'none'
											? 'primary'
											: 'default'
									}
									size="large"
									style={{
										height: '160px !important',
										width: '100%',
										color: '#000',
										backgroundColor:
											this.state.visualization === 'none'
												? '#eaf5ff'
												: '#fff',
									}}
									onClick={() => {
										this.setConfig('visualization', 'none');
										this.setConfig('kibana', false);
										this.setConfig('grafana', false);
									}}
								>
									Built-in dashboard
								</Button>
							</div>

							<div className={esContainer}>
								<Button
									size="large"
									type={
										this.state.visualization === 'kibana'
											? 'primary'
											: 'default'
									}
									css={{
										height: '160px !important',
										width: '100%',
										backgroundColor:
											this.state.visualization ===
											'kibana'
												? '#eaf5ff'
												: '#fff',
									}}
									onClick={() => {
										this.setConfig(
											'visualization',
											'kibana',
										);
										this.setConfig('kibana', true);
										this.setConfig('grafana', false);
									}}
								>
									<img
										width={150}
										src={
											isOpenSearchFlavour
												? `https://opensearch.org/assets/brand/SVG/Logo/opensearch_logo_default.svg`
												: `https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt8781708f8f37ed16/5c11ec2edf09df047814db23/logo-elastic-kibana-lt.svg`
										}
										alt="Kibana"
									/>
								</Button>
								<p>
									The default visualization dashboard for
									ElasticSearch.
								</p>
							</div>
						</div>
					</li>
				) : null}

				{!isSLSCluster ? (
					<li className={card}>
						<div className="col light">
							<h3>Restore From Snapshot</h3>
							<p>Select cluster & snapshots</p>
						</div>

						<div className="col">
							<Select
								css={{
									width: '100%',
									maxWidth: 400,
								}}
								placeholder="Select a cluster"
								onChange={this.handleCluster}
							>
								{this.state.clusters
									.filter(i => i.recipe === 'default')
									.map(item => (
										<Option key={item.id}>
											{item.name}
										</Option>
									))}
							</Select>
							{this.state.isSnapshotsLoading && (
								<p>Snapshots Loading</p>
							)}
							{this.state.snapshots.length > 0 && (
								<Select
									css={{
										width: '100%',
										maxWidth: 400,
										margin: '20px 0',
									}}
									placeholder="Select a snapshot"
									onChange={this.handleSnapshot}
								>
									{this.state.snapshots.map(item => (
										<Option
											key={`${item.id}___${item.repository_name}`}
											value={`${item.id}___${item.repository_name}`}
										>
											{new Date(+item.id * 1000)
												.toString()
												.substring(0, 15)}
										</Option>
									))}
								</Select>
							)}

							{this.state.restore_from && this.state.snapshot_id && (
								<Button
									style={{ marginLeft: 8 }}
									type="primary"
									loading={this.state.isRestoring}
									onClick={this.restoreCluster}
								>
									Restore
								</Button>
							)}
						</div>
					</li>
				) : null}

				{isSLSCluster ? (
					<>
						{setSearchEngine ? (
							<div className={card}>
								<Button
									size="small"
									onClick={() =>
										this.setState({
											setSearchEngine: false,
											backend: '',
											clusterURL: '',
										})
									}
									css={`
										width: max-content;
										position: absolute;
										right: 0;
										border: none;
									`}
								>
									╳
								</Button>
								<div className="col light">
									<h3> Choose search engine </h3>
									<p>{`System backend provides you with ${
										machineMarks[cluster.pricing_plan]
											.searchIndices
									} geo-distributed search indexes on OpenSearch out of the box.`}</p>
								</div>
								<div>
									<div
										className={settingsItem}
										css={{
											padding: 30,
											flexWrap: 'wrap',
											gap: '2rem',
										}}
									>
										{Object.values(BACKENDS)
											.filter(
												backendObj =>
													!BLACK_LISTED_BACKENDS.includes(
														backendObj.name,
													),
											)
											.map(
												({
													name: backend,
													logo,
													text,
												}) => {
													return (
														<Button
															key={backend}
															type={
																backend ===
																this.state
																	.backend
																	? 'primary'
																	: 'default'
															}
															size="large"
															css={{
																height:
																	'160px !important',
																marginRight: 20,
																backgroundColor:
																	backend ===
																	this.state
																		.backend
																		? '#eaf5ff'
																		: '#fff',
																minWidth:
																	'152px',
															}}
															className={
																backend ===
																this.state
																	.backend
																	? fadeOutStyles
																	: ''
															}
															onClick={() => {
																this.setState({
																	backend,
																	clusterURL:
																		'',
																	verifiedCluster: false,
																});
															}}
														>
															{logo ? (
																<img
																	width="120"
																	src={logo}
																	alt={`${backend} logo`}
																/>
															) : (
																<span
																	css={`
																		font-size: 1.4rem;
																		font-weight: 400;
																		color: black;
																	`}
																>
																	{text}
																</span>
															)}
														</Button>
													);
												},
											)}
									</div>

									{this.state.backend !==
										BACKENDS.System.name && (
										<div
											className="col grow vcenter"
											css={{
												flexDirection: 'column',
												alignItems:
													'flex-start !important',
												justifyContent: 'center',
											}}
										>
											<input
												id="elastic-url"
												type="name"
												css={{
													width: '100%',
													maxWidth: 400,
													marginBottom: 10,
													outline: 'none',
													border:
														isInvalidURL &&
														clusterURL !== ''
															? '1px solid red'
															: '1px solid #e8e8e8',
												}}
												placeholder={`Enter your ${capitalizeWord(
													this.state.backend,
												)} URL`}
												value={clusterURL}
												onChange={e =>
													this.setConfig(
														'clusterURL',
														e.target.value,
													)
												}
											/>
											<Button
												onClick={this.handleVerify}
												disabled={!clusterURL}
												loading={verifyingURL}
											>
												Verify Connection
											</Button>

											{verifiedCluster ? (
												<Tag
													style={{ marginTop: 10 }}
													color="green"
												>
													Verified Connection. Version
													Detected: {clusterVersion}
												</Tag>
											) : null}

											{isInvalidURL ? (
												<p
													style={{
														color: 'red',
													}}
												>
													{urlErrorMessage ===
													'Auth Error' ? (
														<React.Fragment>
															We received a
															authentication
															error. Does your
															ElasticSearch
															require additional
															authentication? Read
															more{' '}
															<a
																target="_blank"
																rel="noopener noreferrer"
																href="https://docs.reactivesearch.io/docs/hosting/BYOC/ConnectToYourElasticSearch"
															>
																here
															</a>
															.
														</React.Fragment>
													) : (
														urlErrorMessage
													)}
												</p>
											) : null}
										</div>
									)}
								</div>
							</div>
						) : (
							<Alert
								message={`Serverless Search provides you with ${
									machineMarks[cluster.pricing_plan]
										.searchIndices
								} geo-distributed search indexes on Elasticsearch out of the box.`}
								description={
									<div
										css={`
											width: 100%;
											display: flex;
											align-items: center;
											justify-content: space-between;
											gap: 1rem;
										`}
									>
										<span>
											You can optionally configure your
											own search engine instead for
											dedicated access. This can also be
											done later.
										</span>
										<Button
											size="small"
											onClick={() =>
												this.setState({
													setSearchEngine: true,
												})
											}
										>
											Configure Search Engine
										</Button>
									</div>
								}
								style={{ marginBottom: '1rem' }}
								type="info"
							/>
						)}
					</>
				) : null}
				{isViewer || (
					<div className={clusterButtons}>
						<Button
							onClick={handleDeleteModal}
							danger
							size="large"
							icon={<DeleteOutlined />}
							className="delete"
						>
							Delete Cluster
						</Button>

						<div>
							{!isPaid &&
							window.location.search.startsWith(
								'?subscribe=true',
							) ? (
								<Button
									size="large"
									ref={this.paymentButton}
									css={{
										marginRight: 12,
									}}
									onClick={this.handleStripeModal}
								>
									Pay now
								</Button>
							) : null}
							<Button
								size="large"
								icon={<SaveOutlined />}
								type="primary"
								onClick={this.saveClusterSettings}
								disabled={
									this.state.setSearchEngine &&
									this.state.backend !==
										BACKENDS.System.name &&
									!this.state.verifiedCluster
								}
							>
								Save Cluster Settings
							</Button>
						</div>
					</div>
				)}
			</Fragment>
		);
	}
}

ClusterScreen.defaultProps = {
	isSLSCluster: false,
};

ClusterScreen.propTypes = {
	clusterId: PropTypes.string.isRequired,
	cluster: PropTypes.object.isRequired,
	deployment: PropTypes.object.isRequired,
	handleToken: PropTypes.func.isRequired,
	isPaid: PropTypes.bool,
	handleDeleteModal: PropTypes.func.isRequired,
	isExternalCluster: PropTypes.bool,
	onDeploy: PropTypes.func.isRequired,
	kibana: PropTypes.bool.isRequired,
	grafana: PropTypes.bool.isRequired,
	elasticsearchHQ: PropTypes.bool.isRequired,
	arc: PropTypes.bool.isRequired,
	streams: PropTypes.bool.isRequired,
	isSLSCluster: PropTypes.bool,
};

export default ClusterScreen;

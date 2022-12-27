import {
	ArrowLeftOutlined,
	DeleteOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Alert, Button, message, Modal, Tag, Tooltip } from 'antd';
import React, { Component, Fragment } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Loader from '../../components/Loader';
import { ACC_API } from '../../constants/config';
import ConnectCluster from './components/ConnectCluster';
import DeleteClusterModal from './components/DeleteClusterModal';
import DeploymentStatus from './components/DeploymentStatus';
import Sidebar, { RightContainer } from './components/Sidebar';
import ClusterExploreRedirect from '../../components/ClusterExploreRedirect';
import { ansibleMachineMarks, ARC_BYOC, V7_ARC } from './new';
import { machineMarks as arcMachineMarks } from './NewMyCluster';
import ClusterScreen from './screens/ClusterScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import ScaleClusterScreen from './screens/ScaleClusterScreen';
import ShareClusterScreen from './screens/ShareClusterScreen';
import ClusterMonitoringScreen from './screens/ClusterMonitoring';
import DeployLogs from '../DeployTemplate/DeployLogs';
import { card, clusterContainer, clustersList } from './styles';
import {
	createSubscription,
	deleteCluster,
	deployCluster,
	getAddon,
	getClusterData,
	getArcVersion,
	hasAddon,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	isSandBoxPlan,
} from './utils';
import { regions } from './utils/regions';
import { getUrlParams } from '../../utils/helper';
import StripeCheckout from '../../components/StripeCheckout';

const checkIfUpdateIsAvailable = (version, recipe) => {
	const k8sVersion = (version.split('/')[1] || '').split(':')[1];

	if (recipe === 'byoc') {
		return version && version !== ARC_BYOC.split('-')[0];
	}

	if (k8sVersion) {
		return k8sVersion !== V7_ARC;
	}

	return version && version !== V7_ARC.split('-')[0];
};

class ClusterInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			cluster: null,
			deployment: null,
			kibana: false,
			grafana: false,
			elasticsearchHQ: false,
			arc: false,
			mirage: false,
			error: null,
			deploymentError: '',
			showError: false,
			loadingError: false,
			isPaid: false,
			deleteModal: false,
			streams: false,
			arcVersion: null,
			isStripeCheckoutOpen: false,
			statusFetchCount: 0,
			isFetchingStatus: false,
			deploymentsInProgress: false,
			deploymentDeletionInProgress: false,
		};
		this.paymentButton = React.createRef();
		this.paymentTriggered = false;
	}

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		clearTimeout(this.statusTimer);
	}

	init = () => {
		return getClusterData(get(this, 'props.match.params.id'))
			.then(async res => {
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					const arcData = getAddon('arc', deployment) || {};
					let { addons, ...deployments } = deployment; // eslint-disable-line
					if (addons && addons.length) {
						addons.forEach(index => {
							deployments = {
								...deployments,
								[index.name]: index,
							};
						});
					}
					const deploymentsInProgress = Object.keys(
						deployments,
					).filter(
						source =>
							get(deployments, `${source}.status`) ===
							'in progress',
					);

					const deploymentDeletionInProgress = Object.keys(
						deployments,
					).filter(
						source =>
							get(deployments, `${source}.status`) ===
							'deletion in progress',
					);
					let isArcReady = false;
					try {
						const arcRes = await fetch(`${arcData.url}arc/health`);
						isArcReady = arcRes.status === 200;
					} catch (err) {
						console.log(`Error getting arc status:${err}`);
					}
					const streamsData = getAddon('streams', deployment) || {};
					this.setState({
						cluster,
						deployment,
						kibana: deployment.kibana
							? !!Object.keys(deployment.kibana).length
							: false,
						grafana: deployment.grafana
							? !!Object.keys(deployment.grafana).length
							: false,
						mirage: hasAddon('mirage', deployment),
						dejavu: hasAddon('dejavu', deployment),
						arc: isArcReady,
						elasticsearchHQ: hasAddon(
							'elasticsearch-hq',
							deployment,
						),
						planRate: cluster.plan_rate || 0,
						isPaid: cluster.trial || !!cluster.subscription_id,
						streams: streamsData.status === 'ready',
						error:
							cluster.trial &&
							!isSandBoxPlan(cluster.pricing_plan) &&
							!cluster.subscription_id
								? { code: 402 }
								: null,
						deploymentDeletionInProgress,
						deploymentsInProgress,
					});

					if (
						cluster.status === 'deployments in progress' ||
						deploymentDeletionInProgress.length ||
						deploymentsInProgress.length
					) {
						this.setState(
							prevState => ({
								statusFetchCount:
									prevState.statusFetchCount + 1,
							}),
							() => {
								if (this.state.statusFetchCount <= 5) {
									this.timer = setTimeout(this.init, 30000);
								}
							},
						);
					} else {
						const arcPlanData = await getArcVersion(
							arcData.url,
							arcData.username,
							arcData.password,
						);
						if (arcPlanData.version) {
							this.setState({
								arcVersion: arcPlanData.version,
							});
						}
					}

					this.setState({
						isLoading: false,
					});
				} else {
					this.setState({
						loadingError: true,
						isLoading: false,
					});
				}
				this.triggerPayment();
			})
			.catch(e => {
				const error = JSON.parse(e);
				this.setState(
					state => ({
						...state,
						error: get(error, 'status'),
						planRate: get(
							error,
							'details.plan_rate',
							get(state, 'planRate', 0),
						),
						cluster: get(error, 'details'),
						isLoading: false,
					}),
					this.triggerPayment,
				);
			});
	};

	handleDeleteModal = () => {
		this.setState(prevState => ({
			deleteModal: !prevState.deleteModal,
		}));
	};

	triggerPayment = () => {
		if (
			!this.paymentTriggered &&
			get(this, 'props.location.search', '').startsWith('?subscribe=true')
		) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
				this.paymentTriggered = true;
			}
		}
	};

	deleteCluster = (id = get(this, 'props.match.params.id')) => {
		this.setState({
			isLoading: true,
		});
		deleteCluster(id)
			.then(() => {
				this.props.history.push('/');
			})
			.catch(e => {
				this.setState({
					isLoading: false,
					deploymentError: e,
					showError: true,
				});
			});
	};

	deployCluster = (body, id) => {
		this.setState({
			isLoading: true,
		});
		deployCluster(body, id)
			.then(() => {
				this.init();
			})
			.catch(e => {
				this.setState({
					isLoading: false,
					deploymentError: e,
					showError: true,
				});
			});
	};

	hideErrorModal = () => {
		this.setState({
			showError: false,
			deploymentError: '',
		});
	};

	renderClusterRegion = (region, provider = 'azure') => {
		if (!region) return null;
		if (!regions[provider]) return null;
		const selectedRegion =
			Object.keys(regions[provider]).find(item =>
				region.startsWith(item),
			) || region;

		const { name, flag } = regions[provider][selectedRegion]
			? regions[provider][selectedRegion]
			: { name: 'region', flag: `${selectedRegion}.png` };

		return (
			<div className="region-info">
				<img src={`/static/images/flags/${flag}`} alt="US" />
				<span>{name}</span>
			</div>
		);
	};

	handleToken = async data => {
		try {
			this.setState({
				isStripeCheckoutOpen: false,
			});
			await createSubscription(data);
			this.init();
		} catch (e) {
			console.log(e);
		}
	};

	handleArcUpgrade = async () => {
		try {
			const {
				cluster: { id, recipe },
			} = this.state;
			this.setState({
				statusFetchCount: 0,
				isLoading: true,
			});

			const url = `${ACC_API}/v2/_deploy/${id}`;
			const body = {
				arc: {
					version: recipe === 'byoc' ? ARC_BYOC : V7_ARC,
					status: 'restarted',
				},
			};

			const response = await fetch(url, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			if (response.status >= 400) {
				throw new Error(data);
			}
			this.init();
		} catch (err) {
			message.error('Something went wrong please try again');
			this.setState({
				isLoading: false,
			});
			console.error(err);
		}
	};

	renderErrorScreen = () => {
		const errorCode = String(get(this.state, 'error.code') || '');
		const paymentRequired = errorCode === '402';
		const isNotFound = errorCode === '404';
		const clusterId = get(this, 'props.match.params.id');
		const clusterName = clusterId
			?.split('-')
			?.slice(0, 2)
			?.join('-');
		let errorMsg = 'Some error occurred';
		if (paymentRequired) {
			errorMsg = 'Payment Required';
		} else if (isNotFound) {
			errorMsg = `No cluster found for ${clusterId}. Please make sure to use a valid cluster ID.`;
		}

		return (
			<Fragment>
				{this.state.isStripeCheckoutOpen && (
					<StripeCheckout
						visible={this.state.isStripeCheckoutOpen}
						onCancel={this.handleStripeModal}
						plan={PLAN_LABEL[this.state.cluster.pricing_plan]}
						price={EFFECTIVE_PRICE_BY_PLANS[
							this.state.cluster.pricing_plan
						].toString()}
						monthlyPrice={PRICE_BY_PLANS[
							this.state.cluster.pricing_plan
						].toString()}
						onSubmit={data =>
							this.handleToken({ clusterId, ...data })
						}
					/>
				)}
				<FullHeader
					cluster={clusterId}
					trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
				/>
				<Container>
					<section
						className={clusterContainer}
						style={{ textAlign: 'center', paddingTop: 40 }}
					>
						<article>
							<WarningOutlined css={{ fontSize: 42 }} />
							<h2
								style={{
									maxWidth: 400,
									margin: '0 auto',
								}}
							>
								{errorMsg}
							</h2>
							<p>
								{paymentRequired
									? 'Your regular payment is due for this cluster.'
									: get(this.state, 'error.message')}
							</p>
							<div style={{ marginTop: 30 }}>
								<Link to="/">
									<Button
										size="large"
										icon={<ArrowLeftOutlined />}
										css={{
											marginRight: 12,
										}}
									>
										Go Back
									</Button>
								</Link>

								{paymentRequired ? (
									<Button
										size="large"
										css={{
											marginRight: 12,
										}}
										ref={this.paymentButton}
										onClick={this.handleStripeModal}
									>
										Pay now to access
									</Button>
								) : null}

								{isNotFound ? null : (
									<Button
										onClick={() => {
											this.setState({
												deleteModal: true,
											});
										}}
										danger
										style={{
											marginRight: 12,
										}}
										size="large"
										icon={<DeleteOutlined />}
									>
										Delete Cluster
									</Button>
								)}
							</div>
						</article>
					</section>
				</Container>
				<DeleteClusterModal
					clusterId={clusterId}
					clusterName={clusterName}
					onDelete={this.deleteCluster}
					handleModal={this.handleDeleteModal}
					isVisible={this.state.deleteModal}
				/>
			</Fragment>
		);
	};

	renderClusterAbsentActionButtons = () => (
		<div css={{ marginTop: 20, textAlign: 'center' }}>
			<Button
				size="large"
				onClick={() => this.props.history.push('/')}
				icon={<ArrowLeftOutlined />}
			>
				Go Back
			</Button>

			{get(this, 'state.cluster.user_role') === 'admin' ? (
				<Button
					size="large"
					onClick={() => {
						this.setState({
							deleteModal: true,
						});
					}}
					danger
					css={{
						marginLeft: 12,
					}}
					icon={<DeleteOutlined />}
				>
					Delete Cluster
				</Button>
			) : null}
		</div>
	);

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	refetchDeploymentStatus = async () => {
		try {
			this.setState({
				isFetchingStatus: true,
			});

			await this.init();

			this.setState({
				isFetchingStatus: false,
			});
		} catch (error) {
			this.setState({
				isFetchingStatus: false,
			});
		}
	};

	render() {
		const vcenter = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: 'calc(100vh - 200px)',
			width: '100%',
			fontSize: '20px',
			textAlign: 'center',
			lineHeight: '36px',
		};

		if (this.state.error) {
			return this.renderErrorScreen();
		}

		if (!this.state.cluster) {
			if (this.state.loadingError) {
				return (
					<div style={vcenter}>
						Cluster status isn't available yet
						<br />
						It typically takes 15-30 minutes before a cluster comes
						live.
						{this.renderClusterAbsentActionButtons()}
					</div>
				);
			}
			return <Loader />;
		}

		if (this.state.isLoading) return <Loader />;

		const {
			isPaid,
			deployment,
			cluster,
			isStripeCheckoutOpen,
		} = this.state;

		const isViewer = get(this, 'state.cluster.user_role') === 'viewer';
		const isExternalCluster = get(this, 'state.cluster.recipe') === 'byoc';

		let allMarks = ansibleMachineMarks;

		// override plans for byoc cluster even though they are deployed using ansible
		if (isExternalCluster) {
			allMarks = arcMachineMarks;
		}

		const planDetails = allMarks[this.state.cluster.pricing_plan];
		const arcDeployment =
			deployment &&
			deployment.addons &&
			deployment.addons.find(addon => addon.name === 'arc');

		return (
			<Fragment>
				<FullHeader
					isCluster
					cluster={get(this, 'props.match.params.id')}
					clusterPlan={cluster && cluster.plan_rate}
					trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
				/>
				<Container>
					{isStripeCheckoutOpen && (
						<StripeCheckout
							visible={isStripeCheckoutOpen}
							onCancel={this.handleStripeModal}
							plan={PLAN_LABEL[cluster.pricing_plan]}
							price={EFFECTIVE_PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							monthlyPrice={PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							onSubmit={data =>
								this.handleToken({
									clusterId: cluster.id,
									...data,
								})
							}
						/>
					)}
					<section className={clusterContainer}>
						<Modal
							title="Error"
							open={this.state.showError}
							onOk={this.hideErrorModal}
						>
							<p>{this.state.deploymentError}</p>
						</Modal>
						<article>
							<h2>
								{get(this, 'state.cluster.name')}
								<span className="tag">
									{get(this, 'state.cluster.status') ===
									'delInProg'
										? 'Deletion in progress'
										: get(this, 'state.cluster.status')}
								</span>
							</h2>

							<ul className={clustersList}>
								<li
									key={get(this, 'state.cluster.name')}
									className="cluster-card compact"
								>
									<div className="info-row">
										<div>
											<h4>Region</h4>
											{this.renderClusterRegion(
												this.state.cluster.region,
												this.state.cluster.provider,
											)}
										</div>

										<div>
											<h4>Pricing Plan</h4>
											<div>
												{planDetails.label ||
													this.state.cluster
														.pricing_plan}
												&nbsp;&nbsp;
												{!this.state.cluster.trial &&
												isPaid ? (
													<Tag color="green">
														Paid
													</Tag>
												) : null}
												{this.state.cluster.trial ? (
													<Tooltip title="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires.">
														<Tag
															color="blue"
															style={{
																marginTop: 5,
															}}
														>
															Trial
														</Tag>
													</Tooltip>
												) : null}
											</div>
										</div>

										<div>
											<h4>ES Version</h4>
											<div>
												{this.state.cluster.es_version}
											</div>
										</div>

										{isExternalCluster ? null : (
											<div>
												<h4>Memory / Per Node</h4>
												<div>
													{get(
														ansibleMachineMarks,
														`${this.state.cluster.pricing_plan}.memory`,
														'',
													)}
													GB
												</div>
											</div>
										)}

										{isExternalCluster ? null : (
											<div>
												<h4>Disk Size / Per Node</h4>
												<div>
													{get(
														ansibleMachineMarks,
														`${this.state.cluster.pricing_plan}.storagePerNode`,
														'',
													)}
													GB
												</div>
											</div>
										)}

										<div>
											<h4>Nodes</h4>
											<div>
												{this.state.cluster.total_nodes}
											</div>
										</div>

										{this.state.cluster.trial ? (
											<div>
												<div>
													<Button
														type="primary"
														style={{
															marginTop: 5,
														}}
														onClick={
															this
																.handleStripeModal
														}
														ref={this.paymentButton}
													>
														Upgrade Now
													</Button>
												</div>
											</div>
										) : null}
									</div>
								</li>

								{this.state.cluster.status ===
								'deployments in progress' ? (
									<div>
										<p
											style={{
												textAlign: 'center',
											}}
										>
											Deployment is in progress. Please
											wait.
										</p>
										{this.renderClusterAbsentActionButtons()}
									</div>
								) : null}

								<DeploymentStatus
									deploymentDeletionInProgress={
										this.state.deploymentDeletionInProgress
									}
									deploymentsInProgress={
										this.state.deploymentsInProgress
									}
									isFetchingStatus={
										this.state.isFetchingStatus
									}
									refetchDeploymentStatus={
										this.refetchDeploymentStatus
									}
									statusFetchCount={
										this.state.statusFetchCount
									}
								/>
								{this.state.cluster.status ===
								'deployments in progress' ? (
									<DeployLogs
										clusterId={this.state.cluster.id}
										showClusterDetails={false}
									/>
								) : null}
								{this.state.arc ? (
									<li
										className={card}
										style={{
											justifyContent: 'space-between',
										}}
									>
										<div className="col vcenter">
											<h4
												style={{
													marginBottom: 0,
													color: 'rgba(0,0,0,0.65)',
												}}
											>
												Use reactivesearch.io’s GUI to
												explore your cluster, manage
												indices, build search visually,
												and get search analytics.
											</h4>
										</div>
										<div className="col vcenter">
											<ConnectCluster
												cluster={this.state.cluster}
												deployment={
													this.state.deployment
												}
											/>
											<ClusterExploreRedirect
												arc={getAddon(
													'arc',
													this.state.deployment,
												)}
												clusterName={get(
													this,
													'state.cluster.name',
												)}
												urlParams={{
													...getUrlParams(
														window.location.search,
													),
												}}
											/>
										</div>
									</li>
								) : null}
								{this.state.arc &&
									(this.state.arcVersion ||
										arcDeployment.image) &&
									checkIfUpdateIsAvailable(
										this.state.arcVersion ||
											arcDeployment.image,
										this.state.cluster.recipe,
									) &&
									!isViewer && (
										<Alert
											message="A new reactivesearch.io version is available!"
											description={
												<div
													style={{
														display: 'flex',
														justifyContent:
															'space-between',
														alignItems: 'center',
													}}
												>
													<div>
														A new version{' '}
														{V7_ARC.split('-')[0]}{' '}
														is available now.
														You&apos;re currently on{' '}
														{this.state.arcVersion}.
														See what&apos;s new in{' '}
														<a href="https://github.com/appbaseio/arc/releases">
															this release
														</a>
														.
													</div>
													<Button
														type="primary"
														ghost
														onClick={
															this
																.handleArcUpgrade
														}
													>
														{' '}
														Update Now
													</Button>
												</div>
											}
											type="info"
											showIcon
											style={{
												marginBottom: 25,
											}}
										/>
									)}

								{this.state.cluster.status === 'active' ? (
									<div
										css={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}
									>
										<Sidebar
											id={get(
												this,
												'props.match.params.id',
											)}
											isViewer={isViewer}
											isExternalCluster={
												isExternalCluster
											}
										/>
										<RightContainer>
											<Switch>
												<Route
													exact
													path="/clusters/:id"
													component={() => (
														<ClusterScreen
															clusterId={get(
																this,
																'props.match.params.id',
															)}
															cluster={
																this.state
																	.cluster
															}
															isExternalCluster={
																isExternalCluster
															}
															deployment={
																this.state
																	.deployment
															}
															arc={this.state.arc}
															streams={
																this.state
																	.streams
															}
															kibana={
																this.state
																	.kibana
															}
															grafana={
																this.state
																	.grafana
															}
															mirage={
																this.state
																	.mirage
															}
															dejavu={
																this.state
																	.dejavu
															}
															handleDeleteModal={
																this
																	.handleDeleteModal
															}
															elasticsearchHQ={
																this.state
																	.elasticsearchHQ
															}
															// cluster deployment
															onDeploy={
																this
																	.deployCluster
															}
															onDelete={
																this
																	.deleteCluster
															}
															// payments handling
															planRate={
																this.state
																	.planRate ||
																0
															}
															handleToken={
																this.handleToken
															}
															isPaid={isPaid}
														/>
													)}
												/>
												<Route
													exact
													path="/clusters/:id/monitoring"
													component={() => (
														<ClusterMonitoringScreen
															clusterId={get(
																this,
																'props.match.params.id',
															)}
															deployments={
																this.state
																	.deployment
															}
															plan={get(
																this.state,
																'cluster.pricing_plan',
															)}
														/>
													)}
												/>
												<Route
													exact
													path="/clusters/:id/usage"
													component={() => (
														<InvoiceScreen
															clusterId={get(
																this,
																'props.match.params.id',
															)}
															isTrial={
																this.state
																	.cluster
																	.trial
															}
														/>
													)}
												/>
												<Route
													exact
													path="/clusters/:id/logs"
													component={() => (
														<DeployLogs
															clusterId={get(
																this,
																'props.match.params.id',
															)}
															showClusterDetails={
																false
															}
														/>
													)}
												/>
												{isViewer || (
													<React.Fragment>
														{isExternalCluster ? null : (
															<Route
																exact
																path="/clusters/:id/scale"
																component={() => (
																	<ScaleClusterScreen
																		clusterId={get(
																			this,
																			'props.match.params.id',
																		)}
																		nodes={
																			this
																				.state
																				.cluster
																				.total_nodes
																		}
																		cluster={
																			this
																				.state
																				.cluster
																		}
																		handleStripeSubmit={
																			this
																				.handleToken
																		}
																	/>
																)}
															/>
														)}
														<Route
															exact
															path="/clusters/:id/share"
															component={() => (
																<ShareClusterScreen
																	clusterId={get(
																		this,
																		'props.match.params.id',
																	)}
																/>
															)}
														/>
													</React.Fragment>
												)}
											</Switch>
										</RightContainer>
									</div>
								) : null}
							</ul>
						</article>
					</section>
				</Container>
				<DeleteClusterModal
					clusterId={this.state.cluster.id}
					clusterName={this.state.cluster.name}
					onDelete={this.deleteCluster}
					handleModal={this.handleDeleteModal}
					isVisible={this.state.deleteModal}
				/>
			</Fragment>
		);
	}
}

ClusterInfo.propTypes = {
	history: PropTypes.object.isRequired,
};

export default ClusterInfo;

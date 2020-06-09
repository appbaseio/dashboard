import { Alert, Button, Icon, message, Modal, Tag, Tooltip } from 'antd';
import React, { Component, Fragment } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Stripe from 'react-stripe-checkout';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Loader from '../../components/Loader';
import { ACC_API } from '../../constants/config';
import ConnectCluster from './components/ConnectCluster';
import DeleteClusterModal from './components/DeleteClusterModal';
import DeploymentStatus from './components/DeploymentStatus';
import Overlay from './components/Overlay';
import Sidebar, { RightContainer } from './components/Sidebar';
import { ansibleMachineMarks, ARC_BYOC, machineMarks, V7_ARC } from './new';
import { machineMarks as arcMachineMarks } from './NewMyCluster';
import ClusterScreen from './screens/ClusterScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import ScaleClusterScreen from './screens/ScaleClusterScreen';
import ShareClusterScreen from './screens/ShareClusterScreen';
import { card, clusterContainer, clustersList } from './styles';
import {
	createSubscription,
	deleteCluster,
	deployCluster,
	getAddon,
	getClusterData,
	hasAddon,
	hasAnsibleSetup,
	STRIPE_KEY,
} from './utils';
import { regions } from './utils/regions';

const checkIfUpdateIsAvailable = (image, recipe) => {
	const version = (image.split('/')[1] || '').split(':')[1];

	if (recipe === 'byoc') {
		return version !== ARC_BYOC;
	}

	return version !== V7_ARC;
};

export default class Clusters extends Component {
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
			error: '',
			deploymentError: '',
			showError: false,
			loadingError: false,
			showOverlay: false,
			isPaid: false,
			deleteModal: false,
			streams: false,
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

	getFromPricing = (plan, key) => {
		let allMarks = machineMarks;
		if (hasAnsibleSetup(plan)) {
			allMarks = ansibleMachineMarks;
		}
		const selectedPlan = (
			Object.values(allMarks[this.state.cluster.provider || 'azure']) ||
			[]
		).find(item => item.plan === plan || item.plan.endsWith(plan));

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	};

	init = () => {
		getClusterData(this.props.match.params.id)
			.then(res => {
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					const arcData = getAddon('arc', deployment) || {};
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
						arc: arcData.status === 'ready',
						elasticsearchHQ: hasAddon(
							'elasticsearch-hq',
							deployment,
						),
						planRate: cluster.plan_rate || 0,
						isLoading: false,
						isPaid: cluster.trial || !!cluster.subscription_id,
						streams: streamsData.status === 'ready',
					});

					if (cluster.status === 'deployments in progress') {
						this.timer = setTimeout(this.init, 30000);
					}
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
						error: error.message,
						planRate:
							(error.details
								? error.details.plan_rate
								: state.planRate) || 0,
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
			this.props.location.search.startsWith('?subscribe=true')
		) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
				this.paymentTriggered = true;
			}
		}
	};

	toggleOverlay = () => {
		this.setState(state => ({
			...state,
			showOverlay: !state.showOverlay,
		}));
	};

	deleteCluster = (id = this.props.match.params.id) => {
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

	handleToken = async (clusterId, token) => {
		try {
			await createSubscription(clusterId, token);
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
				isLoading: true,
			});
			const response = await fetch(
				`${ACC_API}/v1/_update_deployment/${id}`,
				{
					method: 'PUT',
					credentials: 'include',
					body: JSON.stringify({
						deployment_name: 'arc',
						image: `siddharthlatest/arc:${
							recipe === 'byoc' ? ARC_BYOC : V7_ARC
						}`,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			const data = await response.json();
			if (response.status >= 400) {
				throw new Error(data);
			}
			this.setState({
				deployment: data,
				isLoading: false,
			});
		} catch (err) {
			message.error('Something went wrong please try again');
			this.setState({
				isLoading: false,
			});
			console.error(err);
		}
	};

	renderErrorScreen = () => {
		const paymentRequired = this.state.error
			.toLowerCase()
			.startsWith('payment');
		const clusterId = this.props.match.params.id;
		return (
			<Fragment>
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
							<Icon css={{ fontSize: 42 }} type="warning" />
							<h2>
								{paymentRequired
									? 'Payment Required'
									: 'Some error occurred'}
							</h2>
							<p>
								{paymentRequired
									? 'Your regular payment is due for this cluster.'
									: this.state.error}
							</p>
							<div style={{ marginTop: 30 }}>
								<Link to="/">
									<Button
										size="large"
										icon="arrow-left"
										css={{
											marginRight: 12,
										}}
									>
										Go Back
									</Button>
								</Link>

								{paymentRequired ? (
									<Stripe
										name="Appbase.io Clusters"
										amount={
											(this.state.planRate || 0) * 100
										}
										token={token =>
											this.handleToken(clusterId, token)
										}
										disabled={false}
										stripeKey={STRIPE_KEY}
										closed={this.toggleOverlay}
									>
										<Button
											size="large"
											ref={this.paymentButton}
											css={{
												marginRight: 12,
											}}
											onClick={this.toggleOverlay}
										>
											Pay now to access
										</Button>
									</Stripe>
								) : null}

								<Button
									onClick={this.deleteCluster}
									type="danger"
									style={{
										marginRight: 12,
									}}
									size="large"
									icon="delete"
								>
									Delete Cluster
								</Button>
							</div>
						</article>
					</section>
				</Container>
			</Fragment>
		);
	};

	renderClusterAbsentActionButtons = () => (
		<div css={{ marginTop: 20, textAlign: 'center' }}>
			<Button
				size="large"
				onClick={() => this.props.history.push('/')}
				icon="arrow-left"
			>
				Go Back
			</Button>

			{this.state.cluster && this.state.cluster.user_role === 'admin' ? (
				<Button
					size="large"
					onClick={this.deleteCluster}
					type="danger"
					css={{
						marginLeft: 12,
					}}
					icon="delete"
				>
					Delete Cluster
				</Button>
			) : null}
		</div>
	);

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
						Cluster status isn{"'"}t available yet
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

		const { showOverlay, isPaid, deployment, cluster } = this.state;

		const isViewer = this.state.cluster.user_role === 'viewer';
		const isExternalCluster = this.state.cluster.recipe === 'byoc';

		let allMarks = machineMarks.gke;

		if (isExternalCluster) {
			allMarks = arcMachineMarks;
		}

		if (hasAnsibleSetup(cluster.pricing_plan)) {
			allMarks = ansibleMachineMarks.gke;
		}

		const planDetails = Object.values(allMarks).find(
			mark =>
				mark.plan === this.state.cluster.pricing_plan ||
				mark.plan.endsWith(this.state.cluster.pricing_plan) ||
				mark.plan.startsWith(this.state.cluster.pricing_plan),
		);

		const arcDeployment =
			deployment &&
			deployment.addons &&
			deployment.addons.find(addon => addon.name === 'arc');
		return (
			<Fragment>
				<FullHeader
					isCluster
					cluster={this.props.match.params.id}
					clusterPlan={cluster && cluster.plan_rate}
					trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
				/>
				{showOverlay && <Overlay />}
				<Container>
					<section className={clusterContainer}>
						<Modal
							title="Error"
							visible={this.state.showError}
							onOk={this.hideErrorModal}
						>
							<p>{this.state.deploymentError}</p>
						</Modal>
						<article>
							<h2>
								{this.state.cluster.name}
								<span className="tag">
									{this.state.cluster.status === 'delInProg'
										? 'Deletion in progress'
										: this.state.cluster.status}
								</span>
							</h2>

							<ul className={clustersList}>
								<li
									key={this.state.cluster.name}
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
												<h4>Memory</h4>
												<div>
													{this.getFromPricing(
														this.state.cluster
															.pricing_plan,
														'memory',
													)}{' '}
													GB
												</div>
											</div>
										)}

										{isExternalCluster ? null : (
											<div>
												<h4>Disk Size</h4>
												<div>
													{this.getFromPricing(
														this.state.cluster
															.pricing_plan,
														'storage',
													)}{' '}
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
													<Stripe
														name="Appbase.io Clusters"
														amount={
															(this.state.cluster
																.plan_rate ||
																0) * 100
														}
														token={token =>
															this.handleToken(
																this.state
																	.cluster.id,
																token,
															)
														}
														disabled={false}
														stripeKey={STRIPE_KEY}
														closed={
															this.toggleOverlay
														}
													>
														<Button
															type="primary"
															style={{
																marginTop: 5,
															}}
															onClick={
																this
																	.toggleOverlay
															}
														>
															Upgrade Now
														</Button>
													</Stripe>
												</div>
											</div>
										) : null}
									</div>
								</li>

								{this.state.cluster.status ===
								'deployments in progress' ? (
									<div>
										<p style={{ textAlign: 'center' }}>
											Deployment is in progress. Please
											wait.
										</p>
										{this.renderClusterAbsentActionButtons()}
									</div>
								) : null}

								<DeploymentStatus
									data={this.state.deployment}
									onProgress={() => {
										this.statusTimer = setTimeout(
											this.init,
											30000,
										);
									}}
								/>

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
												Use appbase.io’s GUI to explore
												your cluster, manage indices,
												build search visually, and get
												search analytics.
											</h4>
										</div>
										<div className="col vcenter">
											<ConnectCluster
												cluster={this.state.cluster}
												deployment={
													this.state.deployment
												}
											/>
											<Link
												to={{
													pathname: `/clusters/${this.props.match.params.id}/explore`,
													state: {
														arc: getAddon(
															'arc',
															this.state
																.deployment,
														),
														cluster: this.state
															.cluster.name,
													},
												}}
											>
												<Button
													type="primary"
													size="large"
												>
													Explore Cluster
												</Button>
											</Link>
										</div>
									</li>
								) : null}
								{this.state.arc &&
									arcDeployment.image &&
									checkIfUpdateIsAvailable(
										arcDeployment.image,
										this.state.cluster.recipe,
									) && (
										<Alert
											message="A new appbase.io version is available!"
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
														{
															arcDeployment.image
																.split('/')[1]
																.split(':')[1]
																.split('-')[0]
														}
														. See what&apos;s new in{' '}
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
											id={this.props.match.params.id}
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
															clusterId={
																this.props.match
																	.params.id
															}
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
													path="/clusters/:id/usage"
													component={() => (
														<InvoiceScreen
															clusterId={
																this.props.match
																	.params.id
															}
															isTrial={
																this.state
																	.cluster
																	.trial
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
																		clusterId={
																			this
																				.props
																				.match
																				.params
																				.id
																		}
																		nodes={
																			this
																				.state
																				.cluster
																				.total_nodes
																		}
																		handleToken={
																			this
																				.handleToken
																		}
																		toggleOverlay={
																			this
																				.toggleOverlay
																		}
																		cluster={
																			this
																				.state
																				.cluster
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
																	clusterId={
																		this
																			.props
																			.match
																			.params
																			.id
																	}
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

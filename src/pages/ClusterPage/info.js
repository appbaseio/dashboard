import React, { Component, Fragment } from 'react';
import {
 Modal, Button, Icon, Tag, Alert, Tooltip,
} from 'antd';
import { Link, Route, Switch } from 'react-router-dom';
import Stripe from 'react-stripe-checkout';

import { regions } from './utils/regions';
import { machineMarks } from './new';
import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Overlay from './components/Overlay';
import Sidebar, { RightContainer } from './components/Sidebar';
import { clusterContainer, clustersList, card } from './styles';
import {
	getClusterData,
	deployCluster,
	deleteCluster,
	createSubscription,
	hasAddon,
	getAddon,
} from './utils';
import { STRIPE_KEY } from './ClusterPage';
import ClusterScreen from './screens/ClusterScreen';
import ScaleClusterScreen from './screens/ScaleClusterScreen';
import ShareClusterScreen from './screens/ShareClusterScreen';
import DeleteClusterModal from './components/DeleteClusterModal';
import DeploymentStatus from './components/DeploymentStatus';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			cluster: null,
			deployment: null,
			kibana: false,
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
		const selectedPlan = (
			Object.values(machineMarks[this.state.cluster.provider || 'azure']) || []
		).find(item => item.plan === plan);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	};

	init = () => {
		getClusterData(this.props.match.params.id)
			.then((res) => {
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					const arcData = getAddon('arc', deployment) || {};
					this.setState({
						cluster,
						deployment,
						kibana: deployment.kibana ? !!Object.keys(deployment.kibana).length : false,
						mirage: hasAddon('mirage', deployment),
						dejavu: hasAddon('dejavu', deployment),
						arc: arcData.status === 'ready',
						elasticsearchHQ: hasAddon('elasticsearch-hq', deployment),
						planRate: cluster.plan_rate || 0,
						isLoading: false,
						isPaid: cluster.trial || !!cluster.subscription_id,
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
			.catch((e) => {
				const error = JSON.parse(e);
				this.setState(
					state => ({
						...state,
						error: error.message,
						planRate: (error.details ? error.details.plan_rate : state.planRate) || 0,
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
		if (!this.paymentTriggered && this.props.location.search.startsWith('?subscribe=true')) {
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
				this.props.history.push('/clusters');
			})
			.catch((e) => {
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
			.catch((e) => {
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

		const { name, flag } = regions[provider][region];
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

	renderErrorScreen = () => {
		const paymentRequired = this.state.error.toLowerCase().startsWith('payment');
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
							<h2>{paymentRequired ? 'Payment Required' : 'Some error occurred'}</h2>
							<p>
								{paymentRequired
									? 'Your regular payment is due for this cluster.'
									: this.state.error}
							</p>
							<div style={{ marginTop: 30 }}>
								<Link to="/clusters">
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
										amount={(this.state.planRate || 0) * 100}
										token={token => this.handleToken(clusterId, token)}
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
				onClick={() => this.props.history.push('/clusters')}
				icon="arrow-left"
			>
				Go Back
			</Button>

			{this.state.cluster.user_role === 'admin' ? (
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
						It typically takes 15-30 minutes before a cluster comes live.
						{this.renderClusterAbsentActionButtons()}
					</div>
				);
			}
			return <Loader />;
		}

		if (this.state.isLoading) return <Loader />;

		const { showOverlay, isPaid } = this.state;

		const isViewer = this.state.cluster.user_role === 'viewer';

		return (
			<Fragment>
				<FullHeader
					isCluster
					cluster={this.props.match.params.id}
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
								<li key={this.state.cluster.name} className="cluster-card compact">
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
												{this.state.cluster.pricing_plan}
												&nbsp;&nbsp;
												{!this.state.cluster.trial && isPaid ? <Tag color="green">Paid</Tag> : null}
												{this.state.cluster.trial
												|| this.state.cluster.subscription_id ? (
													<Stripe
														name="Appbase.io Clusters"
														amount={
															(this.state.cluster.plan_rate || 0)
															* 100
														}
														token={token => this.handleToken(
																this.state.cluster.id,
																token,
															)
														}
														disabled={false}
														stripeKey={STRIPE_KEY}
														closed={this.toggleOverlay}
													>
														<Tooltip title="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires.">
															<Tag color="blue" style={{ marginTop: 5 }} onClick={this.toggleOverlay}>
																Trial
															</Tag>
														</Tooltip>
													</Stripe>
												) : null}
											</div>
										</div>

										<div>
											<h4>ES Version</h4>
											<div>{this.state.cluster.es_version}</div>
										</div>

										<div>
											<h4>Memory</h4>
											<div>
												{this.getFromPricing(
													this.state.cluster.pricing_plan,
													'memory',
												)}{' '}
												GB
											</div>
										</div>

										<div>
											<h4>Disk Size</h4>
											<div>
												{this.getFromPricing(
													this.state.cluster.pricing_plan,
													'storage',
												)}{' '}
												GB
											</div>
										</div>

										<div>
											<h4>Nodes</h4>
											<div>{this.state.cluster.total_nodes}</div>
										</div>
									</div>
								</li>

								{this.state.cluster.status === 'deployments in progress' ? (
									<div>
										<p style={{ textAlign: 'center' }}>
											Deployment is in progress. Please wait.
										</p>
										{this.renderClusterAbsentActionButtons()}
									</div>
								) : null}

								<DeploymentStatus
									data={this.state.deployment}
									onProgress={() => {
										this.statusTimer = setTimeout(this.init, 30000);
									}}
								/>

								{this.state.arc ? (
									<li className={card}>
										<div className="col vcenter" style={{ width: '100%' }}>
											<h4
												style={{
													marginBottom: 0,
													color: 'rgba(0,0,0,0.65)',
												}}
											>
												Use appbase.io’s GUI to explore your cluster, manage
												indices, build search visually, and get search
												analytics.
											</h4>
										</div>
										<div className="col vcenter">
											<Link
												to={{
													pathname: `/clusters/${
														this.props.match.params.id
													}/explore`,
													state: {
														arc: getAddon('arc', this.state.deployment),
													},
												}}
											>
												<Button type="primary" size="large">
													Explore Cluster
												</Button>
											</Link>
										</div>
									</li>
								) : null}

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
										/>
										<RightContainer>
											<Switch>
												<Route
													exact
													path="/clusters/:id"
													component={() => (
														<ClusterScreen
															clusterId={this.props.match.params.id}
															cluster={this.state.cluster}
															deployment={this.state.deployment}
															arc={this.state.arc}
															kibana={this.state.kibana}
															mirage={this.state.mirage}
															dejavu={this.state.dejavu}
															handleDeleteModal={
																this.handleDeleteModal
															}
															elasticsearchHQ={
																this.state.elasticsearchHQ
															}
															// cluster deployment
															onDeploy={this.deployCluster}
															onDelete={this.deleteCluster}
															// payments handling
															planRate={this.state.planRate || 0}
															handleToken={this.handleToken}
															isPaid={isPaid}
														/>
													)}
												/>
												{isViewer || (
													<React.Fragment>
														<Route
															exact
															path="/clusters/:id/scale"
															component={() => (
																<ScaleClusterScreen
																	clusterId={
																		this.props.match.params.id
																	}
																	nodes={
																		this.state.cluster
																			.total_nodes
																	}
																/>
															)}
														/>
														<Route
															exact
															path="/clusters/:id/share"
															component={() => (
																<ShareClusterScreen
																	clusterId={
																		this.props.match.params.id
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

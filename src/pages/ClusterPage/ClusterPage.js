import Icon, {
	CheckCircleTwoTone,
	DeleteOutlined,
	InfoCircleTwoTone,
	PlusOutlined,
	RedoOutlined,
	WarningTwoTone,
} from '@ant-design/icons';
import { Button, Col, Divider, Row, Tooltip } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Directives from '../../components/Directives';
import { getParam } from '../../utils';
import {
	getClusterData,
	createSubscription,
	deleteCluster,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	getClusters,
	PLAN_LABEL,
	isSandBoxPlan,
	CLUSTER_PLANS,
	ARC_PLANS,
} from './utils';
import { mediaKey } from '../../utils/media';
import DeleteClusterModal from './components/DeleteClusterModal';
import StripeCheckout from '../../components/StripeCheckout';
import { ansibleMachineMarks } from './new';
import { machineMarks as arcMachineMarks } from './NewMyCluster';
import { clusterContainer, clustersList, bannerContainer } from './styles';

import { regions } from './utils/regions';

function getHoursDiff(time) {
	const duration = moment().diff(time, 'hours');
	return duration;
}

class ClusterPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			clustersAvailable: true,
			clusters: [],
			deleteClusterId: '',
			deleteClusterName: '',
			deleteModal: false,
			showStripeModal: false,
			currentCluster: null,
			recentClusterDeployed: false,
			recentClusterDetails: {},
			paidPlan: false,
			clusterPlan: 'unsubscribed',
			isFetchingInBackground: false,
			statusFetchCount: 0,
			isFetchingStatus: false,
		};
	}

	componentDidMount() {
		this.initClusters();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	isValidSlsCluster = cluster => {
		if (
			cluster &&
			cluster.tenancy_type === 'multi' &&
			cluster.recipe === 'mtrs'
		)
			return true;

		return false;
	};

	paramsValue = () => {
		const id = getParam('id', window.location.search) || undefined;
		const subscription =
			getParam('subscription', window.location.search) || undefined;
		return {
			id,
			subscription,
		};
	};

	deleteCluster = id => {
		const { clusters } = this.state;
		this.setState({
			isLoading: true,
		});
		const isSLSCluster = this.isValidSlsCluster(
			clusters.find(i => i.id === id) || {},
		);
		deleteCluster(id, isSLSCluster)
			.then(() => {
				this.initClusters();
			})
			.catch(e => {
				this.setState({
					isLoading: false,
					deleteClusterId: '',
					deleteClusterName: '',
				});
				console.log(e);
			});
	};

	handleDeleteModal = () => {
		this.setState(prevState => ({
			deleteModal: !prevState.deleteModal,
		}));
	};

	getFromPricing = (plan, key) => {
		const selectedPlan = get(ansibleMachineMarks, plan);
		return get(selectedPlan, key, '-');
	};

	getPlan = plan => {
		if (
			plan === 'unsubscribed' ||
			get(PRICE_BY_PLANS, plan) >
				get(PRICE_BY_PLANS, this.state.clusterPlan, 0)
		) {
			return plan;
		}
		return this.state.clusterPlan;
	};

	getPlanLabel = plan => {
		if (plan === 'unsubscribed' || plan === 'trial') {
			return plan;
		}
		return PLAN_LABEL[this.state.clusterPlan];
	};

	setClusterPlan = clusters => {
		if (clusters.length > 0) {
			clusters.forEach(cluster => {
				if (cluster.status === 'active') {
					Object.values(CLUSTER_PLANS)
						.concat(Object.values(ARC_PLANS))
						.forEach(plan => {
							if (cluster.pricing_plan === plan) {
								const plan_name = cluster.trial
									? 'trial'
									: this.getPlan(plan);
								this.setState({
									paidPlan: !cluster.trial,
									clusterPlan: plan_name,
								});
							}
						});
				}
			});
		}
		return clusters;
	};

	initClusters = () => {
		return getClusters()
			.then(clusters => this.setClusterPlan(clusters))
			.then(clusters => {
				if (window.Intercom) {
					window.Intercom('update', {
						total_clusters: clusters.length,
						trial_end_date: moment
							.unix(this.props.clusterTrialEndDate)
							.toDate(),
						trial_end_at: this.props.clusterTrialEndDate,
						plan: this.state.paidPlan ? 'paid' : 'free',
						cluster_plan: this.getPlanLabel(this.state.clusterPlan),
					});
				}
				if (!clusters.length) {
					this.props.history.push('/clusters/new');
					return;
				}
				this.setState(
					{
						clustersAvailable: !!clusters.length,
						clusters,
						isLoading: false,
						deleteClusterId: '',
						deleteClusterName: '',
						isFetchingInBackground: false,
					},
					() => {
						clusters.forEach(async cluster => {
							if (
								cluster.status === 'active' &&
								getHoursDiff(cluster.created_at) <= 72
							) {
								const data = await getClusterData(cluster.id);
								if (data && data.cluster && data.deployment) {
									this.setState(() => ({
										recentClusterDeployed: true,
										recentClusterDetails: {
											cluster: data.cluster,
											deployment: data.deployment,
										},
									}));
								}
							}
						});
						const hasInProgressCluster = clusters.some(cluster =>
							get(cluster, 'status', '').endsWith('in progress'),
						);
						if (
							hasInProgressCluster &&
							!this.state.isFetchingInBackground
						) {
							this.setState(
								prevState => ({
									isFetchingInBackground: true,
									statusFetchCount:
										prevState.statusFetchCount + 1,
								}),
								() => {
									if (this.state.statusFetchCount <= 5) {
										this.timer = setTimeout(
											this.initClusters,
											30000,
										);
									} else {
										this.setState({
											isFetchingInBackground: false,
										});
									}
								},
							);
						}
					},
				);
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isLoading: false,
					isFetchingInBackground: false,
				});
			});
	};

	handleToken = async data => {
		try {
			this.setState({
				isLoading: true,
			});
			await createSubscription(data);
			// TODO remove after integrating new stripe version
			window.location.reload();
		} catch (e) {
			console.log('error', e);
		}
	};

	renderClusterRegion = (region, regionProvider = 'gke') => {
		let provider = regionProvider;
		if (regionProvider === 'GCP' || regionProvider === 'gcp')
			provider = 'gke';
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
				{flag && (
					<img src={`/static/images/flags/${flag}`} alt={name} />
				)}
				<span>{name}</span>
			</div>
		);
	};

	setDeleteCluster = ({ name, id }) => {
		this.setState({
			deleteModal: true,
			deleteClusterId: id,
			deleteClusterName: name,
		});
	};

	openStripeModal = cluster => {
		this.setState({
			showStripeModal: true,
			currentCluster: cluster,
		});
	};

	hideStripeModal = () => {
		this.setState({
			showStripeModal: false,
			currentCluster: null,
		});
	};

	renderClusterCard = cluster => {
		if (!cluster) return null;
		const { isUsingClusterTrial, history } = this.props;
		const { showStripeModal, currentCluster } = this.state;
		const isExternalCluster = get(cluster, 'recipe') === 'byoc';
		let allMarks = ansibleMachineMarks;

		// override plans for byoc cluster
		if (isExternalCluster) {
			allMarks = arcMachineMarks;
		}

		const planDetails = allMarks[cluster.pricing_plan];
		const paymentStyles = isExternalCluster
			? {
					paddingLeft: '25%',
					[mediaKey.small]: {
						paddingLeft: 0,
					},
			  }
			: {};
		const isSLSCluster = this.isValidSlsCluster(cluster);

		return (
			<li key={cluster.id} className="cluster-card compact">
				<h3 className="header-container">
					<div>
						<div>
							{cluster.name}
							{cluster.status === 'failed' &&
							getHoursDiff(cluster.created_at) <= 72 ? (
								<span className="tag tag-issue">
									<WarningTwoTone
										twoToneColor="#ffae42"
										style={{
											fontSize: 18,
											paddingRight: '10px',
										}}
									/>
									{'  '}
									<h4 className="tag-text">Issue</h4>
								</span>
							) : (
								<span className="tag">
									{cluster.status === 'delInProg'
										? 'deletion in progress'
										: cluster.status}
								</span>
							)}
							{cluster.role === 'admin' &&
							(cluster.status === 'active' ||
								cluster.status === 'in progress' ||
								cluster.status === 'deployments in progress' ||
								cluster.status === 'failed') ? (
								<Button
									danger
									icon={<DeleteOutlined />}
									className="showOnHover"
									onClick={() =>
										this.setDeleteCluster(cluster)
									}
								>
									Delete
								</Button>
							) : null}
						</div>
					</div>
					{cluster.status === 'failed' &&
						getHoursDiff(cluster.created_at) < 72 && (
							<span className="message-text">
								There was an issue with your cluster&apos;s
								provisioning. Our team is manually reviewing it
								and will provision it for you.
							</span>
						)}
					{isExternalCluster ? (
						<Tooltip
							title={
								<span>
									Bring your own Cluster allows you to bring
									an externally hosted ElasticSearch and take
									advantage of reactivesearch.io features such
									as security, analytics, better developer
									experience.{' '}
									<a
										href="docs.appbase.io"
										target="_blank"
										rel="noopener norefferer"
									>
										Learn More
									</a>
								</span>
							}
						>
							<span
								className="tag top-right"
								style={{ marginRight: 0 }}
							>
								Bring your own Cluster
							</span>
						</Tooltip>
					) : null}
					{!isSLSCluster ? (
						<div
							className="view-logs-button"
							onClick={() =>
								history.push(`/clusters/${cluster.id}/logs`)
							}
						>
							View deploy logs
						</div>
					) : null}
				</h3>

				<div className="info-row">
					{isSLSCluster ? (
						<div>
							<h4>Region</h4>
							<div className="multi-region">
								{this.renderClusterRegion(
									'us-central1-a',
									cluster.provider,
								)}
							</div>

							<div className="multi-region">
								{this.renderClusterRegion(
									'europe-west2-a',
									cluster.provider,
								)}
							</div>

							<div className="multi-region">
								{this.renderClusterRegion(
									'asia-southeast1-a',
									cluster.provider,
								)}
							</div>
						</div>
					) : (
						<div>
							<h4>Region</h4>
							{this.renderClusterRegion(
								cluster.region,
								cluster.provider,
							)}
						</div>
					)}

					<div>
						<h4>Pricing Plan</h4>
						<div>
							{get(planDetails, 'label') || cluster.pricing_plan}
						</div>
					</div>

					{!isSLSCluster ? (
						<div>
							<h4>ES Version</h4>
							<div>{cluster.es_version}</div>
						</div>
					) : null}

					{isExternalCluster || isSLSCluster ? null : (
						<div>
							<h4>Memory</h4>
							<div>
								{this.getFromPricing(
									cluster.pricing_plan,
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
									cluster.pricing_plan,
									'storage',
								)}{' '}
								GB
							</div>
						</div>
					)}

					{!isSLSCluster ? (
						<div>
							<h4>Nodes</h4>
							<div>{cluster.total_nodes}</div>
						</div>
					) : null}

					{cluster.status === 'active' ||
					cluster.status === 'deployments in progress' ? (
						<div>
							{(isUsingClusterTrial &&
								isSandBoxPlan(cluster.pricing_plan)) ||
							cluster.subscription_id ? (
								<Link
									to={`/clusters/${cluster.id}`}
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
									}}
								>
									<Button type="primary">View Details</Button>
								</Link>
							) : (
								<div css={paymentStyles}>
									<p
										css={{
											fontSize: 12,
											lineHeight: '18px',
											color: '#999',
											margin: '-10px 0 12px 0',
										}}
									>
										Your regular payment is due for this
										cluster.
									</p>

									<Button
										onClick={() =>
											this.openStripeModal(cluster)
										}
									>
										Subscribe to access
									</Button>
									<p
										css={{
											fontSize: 12,
											lineHeight: '18px',
											color: '#999',
											margin: '10px 0 12px 0',
										}}
									>
										Need a trial extension?{' '}
										<span
											style={{
												color: 'dodgerblue',
												cursor: 'pointer',
											}}
											onClick={() => {
												if (window.Intercom) {
													window.Intercom('show');
												}
											}}
										>
											Chat with us
										</span>
									</p>
									{showStripeModal &&
										currentCluster.id === cluster.id && (
											<StripeCheckout
												visible={showStripeModal}
												onCancel={this.hideStripeModal}
												plan={
													PLAN_LABEL[
														cluster.pricing_plan
													]
												}
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
								</div>
							)}
						</div>
					) : (
						<div />
					)}
					{cluster.status === 'failed' &&
						getHoursDiff(cluster.created_at) <= 72 && (
							<Button
								type="primary"
								onClick={() => {
									if (window.Intercom) {
										window.Intercom('show');
									}
								}}
							>
								Contact Support
							</Button>
						)}
				</div>
			</li>
		);
	};

	renderClusterHeading = (text, length) =>
		length ? (
			<Divider>
				<b css={{ color: '#999', fontSize: '14px' }}>
					{text} - ({length})
				</b>
			</Divider>
		) : null;

	refetchStatus = async () => {
		try {
			this.setState({
				isFetchingStatus: true,
			});
			await this.initClusters();
			this.setState({
				isFetchingStatus: false,
			});
		} catch (err) {
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
		};

		const {
			isLoading,
			clustersAvailable,
			clusters,
			recentClusterDeployed,
			recentClusterDetails,
		} = this.state;

		const deleteStatus = ['deleted', 'failed'];
		const deletedClusters = clusters.filter(cluster =>
			deleteStatus.includes(cluster.status),
		);
		const activeClusters = clusters.filter(
			cluster => cluster.status === 'active',
		);

		const clustersInProgress = clusters.filter(
			cluster => ![...deleteStatus, 'active'].includes(cluster.status),
		);

		const clusterDeploymentInProgress = clusters.filter(
			cluster => cluster.status === 'in progress',
		);

		if (isLoading) {
			return <Loader />;
		}

		if (!isLoading && !clustersAvailable) {
			return (
				<Fragment>
					<FullHeader isCluster />
					<div style={vcenter}>
						<i className="fas fa-gift" style={{ fontSize: 36 }} />
						<h2 style={{ marginTop: 24, fontSize: 22 }}>
							You&apos;ve unlocked 14 days free trial
						</h2>
						<p style={{ margin: '15px 0 20px', fontSize: 16 }}>
							Get started with clusters today
						</p>
						<div style={{ textAlign: 'center' }}>
							<Link to="/new/serverless-search">
								<Button type="primary">
									<i className="fas fa-plus" />
									&nbsp; Create a New Cluster
								</Button>
							</Link>
						</div>
					</div>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<FullHeader clusters={activeClusters} isCluster />
				<Header>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Welcome to Appbase Clusters</h2>

							<Row>
								<Col lg={18}>
									<p>
										This is your clusters manager view.
										Here, you can create a new cluster and
										manage your existing ones.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,

								[mediaKey.small]: {
									paddingTop: 20,
								},
							}}
						>
							<Link to="/new/serverless-search">
								<Button size="large" type="primary" block>
									<PlusOutlined /> Create a New Cluster
								</Button>
							</Link>
						</Col>
					</Row>
				</Header>
				<Container>
					{clusterDeploymentInProgress.length ? (
						<section className={bannerContainer}>
							<article className="banner banner-bg banner-border">
								<div className="banner__content-wraper">
									<div className="banner__logo-wrapper">
										<InfoCircleTwoTone
											twoToneColor="#fbe137"
											style={{ fontSize: 50 }}
										/>
									</div>
									<div className="banner__text">
										While your cluster is getting deployed,
										get familiarized with the
										reactivesearch.io platform.
									</div>
								</div>

								<Directives />
								{this.state.statusFetchCount >= 5 && (
									<Button
										onClick={this.refetchStatus}
										loading={this.state.isFetchingStatus}
										disabled={this.state.isFetchingStatus}
										icon={<RedoOutlined />}
									>
										Refetch Deployment Status
									</Button>
								)}
							</article>
						</section>
					) : null}
					{recentClusterDeployed ? (
						<section className={bannerContainer}>
							<article className="banner banner-bg banner-border">
								<div className="banner__content-wraper">
									<div className="banner__logo-wrapper">
										<CheckCircleTwoTone
											twoToneColor="#72e538"
											style={{ fontSize: 50 }}
										/>
									</div>
									<div className="banner__text">
										{`Now that your "${
											recentClusterDetails.cluster.name
												.length <= 15
												? recentClusterDetails.cluster
														.name
												: `${recentClusterDetails.cluster.name.substring(
														0,
														14,
												  )}...`
										}" cluster is deployed,
										let's get you started with the reactivesearch.io platform.`}
									</div>
								</div>

								{recentClusterDeployed && (
									<Link
										to={`/clusters/${recentClusterDetails.cluster.id}?connect=true`}
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
										}}
									>
										<Button
											type="primary"
											className="banner-button"
										>
											<Icon
												component={() => (
													<img
														src="/static/images/buttons/getting-started.svg"
														style={{
															width: '17px',
														}}
														alt="getting started"
													/>
												)}
											/>{' '}
											Get started
										</Button>
									</Link>
								)}
							</article>
						</section>
					) : null}
					<section className={clusterContainer}>
						<article>
							<h2>My Clusters</h2>

							{this.renderClusterHeading(
								'Active Appbase Clusters',
								activeClusters.length,
							)}
							{activeClusters.length ? (
								<ul className={clustersList}>
									{activeClusters.map(cluster =>
										this.renderClusterCard(cluster),
									)}
								</ul>
							) : null}

							{this.renderClusterHeading(
								'Clusters in progress',
								clustersInProgress.length,
							)}
							{clustersInProgress.length ? (
								<ul className={clustersList}>
									{clustersInProgress.map(cluster =>
										this.renderClusterCard(cluster),
									)}
								</ul>
							) : null}

							{this.renderClusterHeading(
								'Deleted Clusters',
								deletedClusters.length,
							)}
							{deletedClusters.length ? (
								<ul className={clustersList}>
									{deletedClusters.map(cluster =>
										this.renderClusterCard(cluster),
									)}
								</ul>
							) : null}
						</article>
					</section>
				</Container>

				<DeleteClusterModal
					clusterId={this.state.deleteClusterId}
					clusterName={this.state.deleteClusterName}
					onDelete={this.deleteCluster}
					handleModal={this.handleDeleteModal}
					isVisible={this.state.deleteModal}
				/>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	isUsingClusterTrial: get(state, '$getUserPlan.cluster_trial') || false,
	clusterTrialEndDate: get(state, '$getUserPlan.cluster_tier_validity') || 0,
});
ClusterPage.propTypes = {
	isUsingClusterTrial: PropTypes.bool.isRequired,
	clusterTrialEndDate: PropTypes.number,
	history: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, null)(withRouter(ClusterPage));

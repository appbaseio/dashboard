import { Button, Col, Divider, Icon, Row, Tooltip } from 'antd';
import { get } from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Directives from '../../components/Directives';
import { getParam } from '../../utils';
import { mediaKey } from '../../utils/media';
import DeleteClusterModal from './components/DeleteClusterModal';
import StripeCheckout from '../../components/StripeCheckout';
import { ansibleMachineMarks } from './new';
import { machineMarks as arcMachineMarks } from './NewMyCluster';
import { clusterContainer, clustersList, bannerContainer } from './styles';
import {
	createSubscription,
	deleteCluster,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	getClusters,
	PLAN_LABEL,
	isSandBoxPlan,
} from './utils';
import { regions } from './utils/regions';

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
		};
	}

	componentDidMount() {
		this.initClusters();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

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
		this.setState({
			isLoading: true,
		});
		deleteCluster(id)
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

	getFromPricing = (plan, key, provider = 'azure') => {
		const allMarks = get(ansibleMachineMarks, provider);

		const selectedPlan = Object.values(allMarks).find(
			item =>
				get(item, 'plan') === plan ||
				get(item, 'plan', '').endsWith(plan),
		);
		return get(selectedPlan, key, '-');
	};

	initClusters = () => {
		getClusters()
			.then(clusters => {
				if (window.Intercom) {
					window.Intercom('update', {
						total_clusters: clusters.length,
						trial_end_date: moment
							.unix(this.props.clusterTrialEndDate)
							.toDate(),
						trial_end_at: this.props.clusterTrialEndDate,
					});
				}
				if (!clusters.length) {
					this.props.history.push('/clusters/new');
					return;
				}
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters,
					isLoading: false,
					deleteClusterId: '',
					deleteClusterName: '',
				});

				clusters.every(cluster => {
					if (get(cluster, 'status', '').endsWith('in progress')) {
						this.timer = setTimeout(this.initClusters, 30000);
						return false;
					}
					return true;
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isLoading: false,
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
		const { isUsingClusterTrial } = this.props;
		const { showStripeModal, currentCluster } = this.state;
		const isExternalCluster = get(cluster, 'recipe') === 'byoc';
		let allMarks = ansibleMachineMarks.gke;

		// override plans for byoc cluster
		if (isExternalCluster) {
			allMarks = arcMachineMarks;
		}

		const planDetails = Object.values(allMarks).find(
			mark =>
				mark.plan === cluster.pricing_plan ||
				mark.plan.endsWith(cluster.pricing_plan) ||
				mark.plan.startsWith(cluster.pricing_plan),
		);
		const paymentStyles = isExternalCluster
			? {
					paddingLeft: '25%',
					[mediaKey.small]: {
						paddingLeft: 0,
					},
			  }
			: {};

		return (
			<li key={cluster.id} className="cluster-card compact">
				<h3>
					{cluster.name}
					<span className="tag">
						{cluster.status === 'delInProg'
							? 'deletion in progress'
							: cluster.status}
					</span>
					{cluster.role === 'admin' &&
					(cluster.status === 'active' ||
						cluster.status === 'in progress' ||
						cluster.status === 'deployments in progress') ? (
						<Button
							type="danger"
							icon="delete"
							className="showOnHover"
							onClick={() => this.setDeleteCluster(cluster)}
						>
							Delete
						</Button>
					) : null}
					{isExternalCluster ? (
						<Tooltip
							title={
								<span>
									Bring your own Cluster allows you to bring
									an externally hosted ElasticSearch and take
									advantage of appbase.io features such as
									security, analytics, better developer
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
				</h3>

				<div className="info-row">
					<div>
						<h4>Region</h4>
						{this.renderClusterRegion(
							cluster.region,
							cluster.provider,
						)}
					</div>

					<div>
						<h4>Pricing Plan</h4>
						<div>
							{get(planDetails, 'label') || cluster.pricing_plan}
						</div>
					</div>

					<div>
						<h4>ES Version</h4>
						<div>{cluster.es_version}</div>
					</div>

					{isExternalCluster ? null : (
						<div>
							<h4>Memory</h4>
							<div>
								{this.getFromPricing(
									cluster.pricing_plan,
									'memory',
									cluster.provider,
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
									cluster.provider,
								)}{' '}
								GB
							</div>
						</div>
					)}

					<div>
						<h4>Nodes</h4>
						<div>{cluster.total_nodes}</div>
					</div>

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

		const { isLoading, clustersAvailable, clusters } = this.state;

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
							You
							{"'"}
							ve unlocked 14 days free trial
						</h2>
						<p style={{ margin: '15px 0 20px', fontSize: 16 }}>
							Get started with clusters today
						</p>
						<div style={{ textAlign: 'center' }}>
							<Link to="/clusters/new">
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
							<Link to="/clusters/new">
								<Button size="large" type="primary" block>
									<Icon type="plus" /> Create a New Cluster
								</Button>
							</Link>
						</Col>
					</Row>
				</Header>
				<Container>
					{clustersInProgress.length ? (
						<section className={bannerContainer}>
							<article className="banner banner-bg banner-border">
								<div className="banner__content-wraper">
									<div className="banner__logo-wrapper">
										<Icon
											type="question-circle"
											theme="twoTone"
											twoToneColor="#eeeeeee0"
											style={{ fontSize: 50 }}
										/>
									</div>
									<div className="banner__text">
										While your cluster is getting deployed,
										get familiarized with the appbase.io
										platform.
									</div>
								</div>

								<Directives />
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
export default connect(mapStateToProps, null)(ClusterPage);

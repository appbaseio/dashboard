import React, { Fragment, Component } from 'react';
import { Modal, Button, Icon, Tabs, Tag, Tooltip, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';

import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import PricingSlider from './components/PricingSlider/MyClusterSlider';
import StripeCheckout from '../../components/StripeCheckout';

import { clusterContainer, card } from './styles';
import {
	deployMyCluster,
	getClusters,
	verifyCluster,
	createSubscription,
	ARC_PLANS,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
} from './utils';
import { regions, regionsByPlan } from './utils/regions';
import Header from '../../batteries/components/shared/UpgradePlan/Header';
import { ARC_BYOC } from './new';

const { TabPane } = Tabs;

export const machineMarks = {
	[ARC_PLANS.HOSTED_ARC_BASIC]: {
		label: PLAN_LABEL[ARC_PLANS.HOSTED_ARC_BASIC],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_BASIC],
		plan: ARC_PLANS.HOSTED_ARC_BASIC,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_BASIC],
	},
	[ARC_PLANS.HOSTED_ARC_BASIC_V2]: {
		label: ARC_PLANS[ARC_PLANS.HOSTED_ARC_BASIC_V2],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_BASIC_V2],
		plan: ARC_PLANS.HOSTED_ARC_BASIC_V2,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_BASIC_V2],
	},
	[ARC_PLANS.HOSTED_ARC_STANDARD]: {
		label: ARC_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD],
		plan: ARC_PLANS.HOSTED_ARC_STANDARD,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD],
	},
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE]: {
		label: ARC_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE],
		plan: ARC_PLANS.HOSTED_ARC_ENTERPRISE,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE],
	},
	[ARC_PLANS.HOSTED_ARC_STANDARD_2021]: {
		label: ARC_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD_2021],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD_2021],
		plan: ARC_PLANS.HOSTED_ARC_STANDARD_2021,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_STANDARD_2021],
	},
	[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021]: {
		label: ARC_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021],
		nodes: 1,
		cost: PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021],
		plan: ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021,
		pph: EFFECTIVE_PRICE_BY_PLANS[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021],
	},
};

export const priceSlider = {
	0: machineMarks[ARC_PLANS.HOSTED_ARC_BASIC_V2],
	50: machineMarks[ARC_PLANS.HOSTED_ARC_STANDARD_2021],
	100: machineMarks[ARC_PLANS.HOSTED_ARC_ENTERPRISE_2021],
};

const namingConvention = {
	azure:
		'Name must start with a lowercase letter followed by upto 31 lowercase letters, numbers or hyphens and cannot end with a hyphen.',
	gke:
		'Name must start with a lowercase letter followed by upto 31 lowercase letters, numbers or hyphens and cannot end with a hyphen.',
};

class NewMyCluster extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			clusterName: '',
			clusterURL: '',
			pricing_plan: ARC_PLANS.HOSTED_ARC_BASIC_V2,
			region: 'us-central1',
			verifyingURL: false,
			error: '',
			isInvalidURL: false,
			clusters: [],
			deploymentError: '',
			showError: false,
			isClusterLoading: true,
			clusterVersion: '',
			verifiedCluster: false,
			isStripeCheckoutOpen: false,
		};
	}

	componentDidMount() {
		getClusters()
			.then(clusters => {
				const activeClusters = clusters.filter(
					item =>
						(item.status === 'active' ||
							item.status === 'in progress') &&
						item.role === 'admin',
				);
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters: activeClusters,
					isClusterLoading: false,
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isClusterLoading: false,
				});
			});
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	setPricing = plan => {
		this.setState({
			pricing_plan: plan.plan,
		});
	};

	toggleConfig = type => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	validateClusterName = () => {
		const { clusterName } = this.state;
		const pattern = /^[a-z]+[-a-z0-9]*[a-z0-9]$/;
		return pattern.test(clusterName);
	};

	hideErrorModal = () => {
		this.setState({
			showError: false,
			deploymentError: '',
		});
	};

	handleVerify = async () => {
		const { clusterURL } = this.state;
		if (clusterURL) {
			this.setState({
				verifyingURL: true,
				verifiedCluster: false,
				clusterVersion: '',
			});
			verifyCluster(clusterURL)
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

	createCluster = async (stripeData = {}) => {
		try {
			if (!this.validateClusterName()) {
				// prettier-ignore
				const errorMessage = 'Name must start with a lowercase letter followed by upto 31 lowercase letters, numbers or hyphens and cannot end with a hyphen.';
				this.setState({
					error: errorMessage,
				});
				document.getElementById('cluster-name').focus();
				return;
			}

			if (!this.state.region) {
				this.setState({
					error: 'Please select a region to deploy your cluster',
				});
				return;
			}

			if (!this.state.clusterURL) {
				this.setState({
					error: 'Please enter URL',
				});
				return;
			}

			this.setState({
				isLoading: true,
			});

			const body = {
				elasticsearch_url: this.state.clusterURL,
				cluster_name: this.state.clusterName,
				pricing_plan: this.state.pricing_plan,
				location: this.state.region,
				arc_image: ARC_BYOC,
				is_multi_zone: false,
			};

			if (stripeData.token) {
				body.enable_monitoring = true;
			}

			const clusterRes = await deployMyCluster(body);
			if (stripeData.token) {
				await createSubscription({
					clusterId: clusterRes.cluster.id,
					...stripeData,
				});
				this.props.history.push('/');
			}
		} catch (e) {
			this.setState({
				isLoading: false,
				deploymentError: e,
				showError: true,
			});
		}
	};

	renderRegions = () => {
		const { pricing_plan: pricingPlan } = this.state;
		const provider = 'gke';
		const allowedRegions = regionsByPlan[provider][pricingPlan];

		const asiaRegions = Object.keys(regions[provider]).filter(
			item => regions[provider][item].continent === 'asia',
		);
		const euRegions = Object.keys(regions[provider]).filter(
			item => regions[provider][item].continent === 'eu',
		);
		const usRegions = Object.keys(regions[provider]).filter(
			item => regions[provider][item].continent === 'us',
		);
		const otherRegions = Object.keys(regions[provider]).filter(
			item => !regions[provider][item].continent,
		);

		const regionsToRender = data =>
			data.map(region => {
				const regionValue = regions[provider][region];
				const isDisabled = allowedRegions
					? !allowedRegions.includes(region)
					: false;
				return (
					// eslint-disable-next-line
					<li
						key={region}
						onClick={() => this.setConfig('region', region)}
						className={
							// eslint-disable-next-line
							isDisabled
								? 'disabled'
								: this.state.region === region
								? 'active'
								: ''
						}
					>
						{regionValue.flag && (
							<img
								src={`/static/images/flags/${regionValue.flag}`}
								alt={regionValue.name}
							/>
						)}
						<span>{regionValue.name}</span>
					</li>
				);
			});

		const style = { width: '100%' };
		if (provider === 'azure') {
			return (
				<ul style={style} className="region-list">
					{regionsToRender(Object.keys(regions[provider]))}
				</ul>
			);
		}

		return (
			<Tabs size="large" style={style}>
				<TabPane tab="America" key="america">
					<ul className="region-list">
						{regionsToRender(usRegions)}
					</ul>
				</TabPane>
				<TabPane tab="Asia" key="asia">
					<ul className="region-list">
						{regionsToRender(asiaRegions)}
					</ul>
				</TabPane>
				<TabPane tab="Europe" key="europe">
					<ul className="region-list">
						{regionsToRender(euRegions)}
					</ul>
				</TabPane>
				<TabPane tab="Other Regions" key="other">
					<ul className="region-list">
						{regionsToRender(otherRegions)}
					</ul>
				</TabPane>
			</Tabs>
		);
	};

	handleError = () => {
		const that = this;
		Modal.error({
			title: 'Error',
			content: this.state.deploymentError,
			onOk() {
				that.setState({
					showError: false,
				});
			},
		});
	};

	handleCluster = value => {
		this.setState({
			restore_from: value,
		});
	};

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleStripeSubmit = data => {
		this.createCluster(data);
		this.setState({ isStripeCheckoutOpen: false });
	};

	render() {
		const {
			isLoading,
			isInvalidURL,
			urlErrorMessage,
			verifiedCluster,
			clusterVersion,
			verifyingURL,
			clusters,
		} = this.state;
		const { isUsingClusterTrial } = this.props;

		const activeClusters = clusters.filter(
			cluster => cluster.status === 'active',
		);

		const isInvalid = !this.validateClusterName();
		if (isLoading) return <Loader />;

		return (
			<Fragment>
				<FullHeader clusters={activeClusters} isCluster />
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col md={18}>
							<h2>
								Deploy appbase.io for your ElasticSearch Cluster
							</h2>
							<Row>
								<Col span={18}>
									<p>
										Get a better security, analytics and
										development experience with your own
										ElasticSearch cluster.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							md={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Tooltip title="Don't already have an ElasticSearch Cluster? Get a hosted ElasticSearch cluster with appbase.io.">
								<Button
									size="large"
									type="primary"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() =>
										this.props.history.push('/clusters/new')
									}
									icon="question-circle"
								>
									Don&apos;t have a Cluster
								</Button>
							</Tooltip>
						</Col>
					</Row>
				</Header>
				<Container>
					{this.state.isStripeCheckoutOpen && (
						<StripeCheckout
							visible={this.state.isStripeCheckoutOpen}
							plan={PLAN_LABEL[this.state.pricing_plan]}
							price={EFFECTIVE_PRICE_BY_PLANS[
								this.state.pricing_plan
							].toString()}
							monthlyPrice={PRICE_BY_PLANS[
								this.state.pricing_plan
							].toString()}
							onCancel={this.handleStripeModal}
							onSubmit={this.handleStripeSubmit}
						/>
					)}
					<section className={clusterContainer}>
						{this.state.showError ? this.handleError() : null}
						<article>
							<div className={card}>
								<div className="col light">
									<h3>Pick the pricing plan</h3>
									<p>Scale as you go</p>
									{isUsingClusterTrial ? (
										<p>
											<b>Note: </b>You can only create{' '}
											{
												machineMarks[
													this.state.pricing_plan
												].label
											}{' '}
											Cluster while on trial.
										</p>
									) : null}
								</div>

								<PricingSlider
									sliderProps={{
										disabled: isUsingClusterTrial,
									}}
									marks={priceSlider}
									onChange={this.setPricing}
									showNoCardNeeded={
										isUsingClusterTrial &&
										this.state.clusters.length < 1
									}
								/>
							</div>

							<div className={card}>
								<div className="col light">
									<h3>Pick a region</h3>
									<p>All around the globe</p>
								</div>
								<div className="col grow region-container">
									{this.renderRegions()}
								</div>
							</div>

							<div className={card}>
								<div className="col light">
									<h3>Choose a cluster name</h3>
									<p>
										Name your cluster. A name is permanent.
									</p>
								</div>
								<div
									className="col grow vcenter"
									css={{
										flexDirection: 'column',
										alignItems: 'flex-start !important',
										justifyContent: 'center',
									}}
								>
									<input
										id="cluster-name"
										type="name"
										css={{
											width: '100%',
											maxWidth: 400,
											marginBottom: 10,
											outline: 'none',
											border:
												isInvalid &&
												this.state.clusterName !== ''
													? '1px solid red'
													: '1px solid #e8e8e8',
										}}
										placeholder="Enter your cluster name"
										value={this.state.clusterName}
										onChange={e =>
											this.setConfig(
												'clusterName',
												e.target.value,
											)
										}
									/>
									<p
										style={{
											color:
												isInvalid &&
												this.state.clusterName !== ''
													? 'red'
													: 'inherit',
										}}
									>
										{namingConvention.gke}
									</p>
								</div>
							</div>

							<div className={card}>
								<div className="col light">
									<h3>
										Connect to your ElasticSearch Cluster
									</h3>
									<p>
										Enter your Cluster credentials and
										username
									</p>
								</div>
								<div
									className="col grow vcenter"
									css={{
										flexDirection: 'column',
										alignItems: 'flex-start !important',
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
												this.state.clusterURL !== ''
													? '1px solid red'
													: '1px solid #e8e8e8',
										}}
										placeholder="Enter your Elastic URL"
										value={this.state.clusterURL}
										onChange={e =>
											this.setConfig(
												'clusterURL',
												e.target.value,
											)
										}
									/>
									<Button
										onClick={this.handleVerify}
										disabled={!this.state.clusterURL}
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
													We received a authentication
													error. Does your
													ElasticSearch require
													additional authentication?
													Read more{' '}
													<a
														target="_blank"
														rel="noopener noreferrer"
														href="https://docs.appbase.io/docs/hosting/BYOC/ConnectToYourElasticSearch"
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
							</div>

							<div
								style={{ textAlign: 'right', marginBottom: 40 }}
							>
								{this.state.error ? (
									<p
										style={{
											color: 'tomato',
											margin: '20px 0',
										}}
									>
										{this.state.error}
									</p>
								) : null}
								{(isUsingClusterTrial &&
									this.state.pricing_plan !==
										ARC_PLANS.HOSTED_ARC_BASIC_V2) ||
								clusters.length > 0 ? (
									<Button
										type="primary"
										size="large"
										disabled={
											!this.validateClusterName() ||
											!this.state.region ||
											!this.state.clusterURL ||
											!this.state.verifiedCluster
										}
										onClick={this.handleStripeModal}
									>
										Add payment info and create cluster
										<Icon
											type="arrow-right"
											theme="outlined"
										/>
									</Button>
								) : (
									<Button
										type="primary"
										size="large"
										onClick={this.createCluster}
									>
										Create Cluster
										<Icon
											type="arrow-right"
											theme="outlined"
										/>
									</Button>
								)}
							</div>
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	isUsingClusterTrial: get(state, '$getUserPlan.cluster_trial') || false,
});

NewMyCluster.propTypes = {
	isUsingClusterTrial: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(NewMyCluster);

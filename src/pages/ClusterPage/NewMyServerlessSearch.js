/* eslint-disable no-plusplus */
import React, { Fragment, Component } from 'react';
import { Modal, Button, Tag, Tooltip, Row, Col, Alert } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { generateSlug } from 'random-word-slugs';
import { ArrowRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import AnimatedNumber from 'react-animated-number/build/AnimatedNumber';
import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import PricingSlider from './components/PricingSlider/MyClusterSlider';
import StripeCheckout from '../../components/StripeCheckout';
import Header from '../../batteries/components/shared/UpgradePlan/Header';

import {
	deployMySlsCluster,
	getClusters,
	verifyCluster,
	createSubscription,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	BACKENDS,
	capitalizeWord,
	CLUSTER_PLANS,
} from './utils';
import {
	clusterContainer,
	card,
	fadeOutStyles,
	settingsItem,
	clusterInfo,
} from './styles';

let interval;

const BLACK_LISTED_BACKENDS = [];

export const machineMarks = {
	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		plan: CLUSTER_PLANS.CLUSTER_SLS_HOBBY,
		bandWidth: 1,
		postBandWidthConsumption: 3,
		dataStorage: 1,
		searchIndices: 2,
	},
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		plan: CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION,
		bandWidth: 10,
		postBandWidthConsumption: 3,
		dataStorage: 10,
		searchIndices: 4,
	},
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		plan: CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE,
		bandWidth: 100,
		postBandWidthConsumption: 3,
		dataStorage: null,
		searchIndices: 10,
	},
};

export const priceSlider = {
	0: machineMarks[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
	50: machineMarks[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
	100: machineMarks[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
};

const namingConvention = {
	azure:
		'Name must start with a lowercase letter followed by upto 21 lowercase letters, numbers or hyphens and cannot end with a hyphen.',
	gke:
		'Name must start with a lowercase letter followed by upto 21 lowercase letters, numbers or hyphens and cannot end with a hyphen.',
};

class NewMyCluster extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			clusterName: '',
			changed: false,
			clusterURL: '',
			pricing_plan: CLUSTER_PLANS.CLUSTER_SLS_HOBBY,
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
			activeKey: 'america',
			backend: BACKENDS.ELASTICSEARCH.name,
			setSearchEngine: false,
		};
	}

	componentDidMount() {
		const slug = generateSlug(2);
		this.setState({
			clusterName: slug,
		});

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

	createCluster = async (stripeData = {}) => {
		const {
			isDeployTemplate,
			location,
			setClusterId,
			setActiveKey,
			setTabsValidated,
		} = this.props;
		try {
			if (!this.validateClusterName()) {
				// prettier-ignore
				const errorMessage = 'Name must start with a lowercase letter followed by upto 21 lowercase letters, numbers or hyphens and cannot end with a hyphen.';
				this.setState({
					error: errorMessage,
				});
				document.getElementById('cluster-name').focus();
			}

			if (this.state.setSearchEngine && !this.state.clusterURL) {
				this.setState({
					error: 'Please enter URL',
				});
			}

			this.setState({
				isLoading: true,
			});

			const obj = {};
			if (isDeployTemplate) {
				obj.pipeline_info = localStorage.getItem(
					location.search.split('=')[1],
				);
			}

			const body = {
				cluster_name: this.state.clusterName,
				pricing_plan: this.state.pricing_plan,
				backend: this.state.setSearchEngine
					? this.state.backend
					: 'system',
				...(this.state.setSearchEngine
					? {
							backend_url: this.state.clusterURL,
					  }
					: {}),
				...obj,
			};

			if (stripeData.token) {
				body.enable_monitoring = true;
			}

			const clusterRes = await deployMySlsCluster(body);
			if (clusterRes.cluster && clusterRes.cluster.id) {
				setClusterId(clusterRes.cluster.id);
			}
			if (isDeployTemplate && clusterRes.cluster.id) {
				setActiveKey('3');
				setTabsValidated(true);
				this.setState({
					isLoading: false,
				});
			}
			if (stripeData.token) {
				await createSubscription({
					clusterId: clusterRes.cluster.id,
					...stripeData,
				});
				this.props.history.push('/');
			} else {
				this.props.history.push('/');
			}
		} catch (e) {
			this.setState({
				isLoading: false,
				deploymentError: e,
				showError: true,
			});
			console.error('Error to create cluster', e);
		}
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

	checkResponseTime = async url => {
		const time1 = performance.now();
		await fetch(url, { method: 'GET', mode: 'no-cors' });
		return performance.now() - time1;
	};

	setActiveKey = key => {
		this.setState({
			activeKey: key,
		});
	};

	renderCustomPriceCard = mark => {
		return (
			<div className="col grey">
				<div className={clusterInfo}>
					<div className="mb-10">
						<div
							className="price"
							css={`
								font-size: 20px !important;
							`}
						>
							{mark.cost ? (
								<>
									<span>$</span>
									<AnimatedNumber
										value={mark.cost}
										duration={100}
										stepPrecision={0}
									/>{' '}
									/mo
								</>
							) : (
								'Contact Us'
							)}
						</div>
						<span>
							{mark.cost
								? 'Estimated Cost'
								: 'Annual billing available'}
						</span>
					</div>
				</div>
				<div className={clusterInfo}>
					<div className="mb-10">
						<div
							className="price"
							css={`
								font-size: 20px !important;
							`}
						>
							<AnimatedNumber
								value={mark.bandWidth}
								duration={100}
								stepPrecision={0}
							/>{' '}
							GB data bandwidth included
						</div>
						<span>
							${mark.postBandWidthConsumption}/GB thereafter based
							on usage
						</span>
					</div>
				</div>
				<div className={clusterInfo}>
					<div className="mb-10">
						<div
							className="price"
							css={`
								font-size: 20px !important;
							`}
						>
							{mark.dataStorage ? (
								<>
									<AnimatedNumber
										value={mark.dataStorage}
										duration={100}
										stepPrecision={0}
									/>{' '}
									GB data storage
								</>
							) : (
								'Unlimited Data Storage'
							)}
						</div>
						<span>
							{mark.searchIndices} search indexes included
						</span>
					</div>
				</div>
			</div>
		);
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
			changed,
			clusterName,
		} = this.state;
		const { isUsingClusterTrial, isDeployTemplate, pipeline } = this.props;

		const activeClusters = clusters.filter(
			cluster => cluster.status === 'active',
		);

		const isInvalid = !this.validateClusterName();
		if (isLoading) return <Loader />;

		return (
			<Fragment>
				{!isDeployTemplate ? (
					<>
						<FullHeader clusters={activeClusters} isCluster />
						<Header compact>
							<Row
								type="flex"
								justify="space-between"
								gutter={16}
								style={{ padding: '2rem' }}
							>
								<Col md={18}>
									<h2>Create a Serverless Search Instance</h2>
									<Row>
										<Col span={18}>
											<p>
												Build and deploy search UIs with
												point and click, out of the box
												search analytics and insights
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
									<Tooltip title="Setup Elasticsearch or OpenSearch with ReactiveSearch in a cloud region of your choice.">
										<Button
											size="large"
											type="default"
											target="_blank"
											rel="noopener noreferrer"
											onClick={() => {
												if (interval)
													clearInterval(interval);
												this.props.history.push(
													'/clusters/new',
												);
											}}
											icon={<InfoCircleOutlined />}
										>
											Setup Elasticsearch instead
										</Button>
									</Tooltip>
								</Col>
							</Row>
						</Header>
					</>
				) : null}

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
									showPPH={false}
									showNodesSupported={false}
									customCardNode={this.renderCustomPriceCard}
								/>
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
												isInvalid && clusterName !== ''
													? '1px solid red'
													: '1px solid #40a9ff',
										}}
										placeholder="Enter your cluster name"
										value={clusterName}
										onChange={e => {
											this.setState({
												changed: true,
											});
											this.setConfig(
												'clusterName',
												e.target.value,
											);
										}}
									/>
									{!changed && (
										<p style={{ color: 'orange' }}>
											This is an auto-generated cluster
											name. You can edit this.
										</p>
									)}
									<p
										style={{
											color:
												isInvalid && clusterName !== ''
													? 'red'
													: 'inherit',
										}}
									>
										{namingConvention.gke}
									</p>
								</div>
							</div>

							{this.state.setSearchEngine ? (
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
																		this
																			.state
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
																	this.setState(
																		{
																			backend,
																		},
																	);
																}}
															>
																{logo ? (
																	<img
																		width="120"
																		src={
																			logo
																		}
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
														this.state
															.clusterURL !== ''
															? '1px solid red'
															: '1px solid #e8e8e8',
												}}
												placeholder={`Enter your ${capitalizeWord(
													this.state.backend,
												)} URL`}
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
												disabled={
													!this.state.clusterURL
												}
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
									</div>
								</div>
							) : (
								<Alert
									message={`Serverless Search provides you with ${
										machineMarks[this.state.pricing_plan]
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
												You can optionally configure
												your own search engine instead
												for dedicated access. This can
												also be done later.
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

								<Button
									type="primary"
									size="large"
									onClick={this.createCluster}
								>
									{isDeployTemplate ? (
										<>
											Deploy cluster with pipeline &nbsp;
											{pipeline}
										</>
									) : (
										<>Create Cluster</>
									)}
									<ArrowRightOutlined />
								</Button>

								{/* {(isUsingClusterTrial &&
									this.state.pricing_plan !==
										ARC_PLANS.HOSTED_ARC_BASIC_V2) ||
								clusters.length > 0 ? (
									<Button
										type="primary"
										size="large"
										disabled={
											!this.validateClusterName() ||
											(this.state.setSearchEngine
												? !this.state.clusterURL ||
												  !this.state.verifiedCluster
												: false)
										}
										onClick={this.handleStripeModal}
									>
										{isDeployTemplate ? (
											<>
												Add payment info and Deploy
												cluster with pipeline&nbsp;
												{pipeline}
											</>
										) : (
											<>
												Add payment info and create
												cluster
											</>
										)}
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
										{isDeployTemplate ? (
											<>
												Deploy cluster with pipeline
												&nbsp;
												{pipeline}
											</>
										) : (
											<>Create Cluster</>
										)}
										<Icon
											type="arrow-right"
											theme="outlined"
										/>
									</Button>
								)} */}
							</div>
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}
NewMyCluster.defaultProps = {
	isDeployTemplate: false,
	pipeline: '',
	setClusterId: () => {},
	setActiveKey: () => {},
	setTabsValidated: () => {},
};

NewMyCluster.propTypes = {
	isUsingClusterTrial: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	isDeployTemplate: PropTypes.bool,
	pipeline: PropTypes.string,
	setClusterId: PropTypes.func,
	setActiveKey: PropTypes.func,
	setTabsValidated: PropTypes.func,
};

const mapStateToProps = state => ({
	isUsingClusterTrial: get(state, '$getUserPlan.cluster_trial') || false,
});

export default connect(mapStateToProps, null)(NewMyCluster);

import React, { Component, Fragment } from 'react';
import { Modal, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Stripe from 'react-stripe-checkout';

import { regions } from './utils/regions';
import { machineMarks } from './new';
import FullHeader from '../../components/FullHeader';
import CredentialsBox from './components/CredentialsBox';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import {
	clusterContainer,
	clustersList,
	card,
	settingsItem,
	clusterEndpoint,
	clusterButtons,
} from './styles';
import {
	getClusterData,
	deployCluster,
	deleteCluster,
	createSubscription,
} from './utils';
import { STRIPE_KEY } from './ClusterPage';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: null,
			deployment: null,
			kibana: false,
			logstash: false,
			elasticsearchHQ: false,
			arc: false,
			mirage: false,
			error: '',
			deploymentError: '',
			showError: false,
			loadingError: false,
		};
		this.paymentButton = React.createRef();
	}

	componentDidMount() {
		this.init();
	}

	getFromPricing = (plan, key) => {
		const selectedPlan = (
			Object.values(machineMarks[this.state.cluster.provider || 'azure']) || []
		).find(item => item.plan === plan);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	};

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	init = () => {
		getClusterData(this.props.match.params.id)
			.then((res) => {
				this.originalCluster = res;
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					const arcData = this.getAddon('arc', deployment);
					this.setState({
						cluster,
						deployment,
						kibana: deployment.kibana ? !!Object.keys(deployment.kibana).length : false,
						logstash: deployment.logstash
							? !!Object.keys(deployment.logstash).length
							: false,
						mirage: this.hasAddon('mirage', deployment),
						dejavu: this.hasAddon('dejavu', deployment),
						arc: arcData && arcData.url.startsWith('https://'),
						elasticsearchHQ: this.hasAddon('elasticsearch-hq', deployment),
					});

					if (cluster.status === 'deployments in progress') {
						setTimeout(this.init, 30000);
					}
				} else {
					this.setState({
						loadingError: true,
					});
				}
				this.triggerPayment();
			})
			.catch((e) => {
				this.setState({
					error: e,
				}, this.triggerPayment);
			});
	};

	triggerPayment = () => {
		if (this.props.location.search.startsWith('?subscribe=true')) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
			}
		}
	}

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	hasAddon = (item, source) => !!(source.addons || []).find(key => key.name === item);

	getAddon = (item, source) => (source.addons || []).find(key => key.name === item);

	includedInOriginal = (key) => {
		const original = this.originalCluster.deployment;
		return original[key] ? !!Object.keys(original[key]).length : this.hasAddon(key, original);
	};

	deleteCluster = () => {
		deleteCluster(this.props.match.params.id)
			.then(() => {
				this.props.history.push('/clusters');
			})
			.catch((e) => {
				this.setState({
					deploymentError: e,
					showError: true,
				});
			});
	};

	saveClusterSettings = () => {
		const body = {
			remove_deployments: [],
		};

		if (this.state.kibana && !this.includedInOriginal('kibana')) {
			body.kibana = {
				create_node: false,
				version: this.state.cluster.es_version,
			};
		} else if (!this.state.kibana && this.includedInOriginal('kibana')) {
			body.remove_deployments = [...body.remove_deployments, 'kibana'];
		}

		if (this.state.logstash && !this.includedInOriginal('logstash')) {
			body.logstash = {
				create_node: false,
				version: this.state.cluster.es_version,
			};
		} else if (!this.state.logstash && this.includedInOriginal('logstash')) {
			body.remove_deployments = [...body.remove_deployments, 'logstash'];
		}

		if (this.state.dejavu && !this.includedInOriginal('dejavu')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'dejavu',
					image: 'appbaseio/dejavu:3.0.0-alpha',
					exposed_port: 1358,
				},
			];
		} else if (!this.state.dejavu && this.includedInOriginal('dejavu')) {
			body.remove_deployments = [...body.remove_deployments, 'dejavu'];
		}

		if (this.state.arc && !this.includedInOriginal('arc')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'arc',
					image: 'siddharthlatest/arc:0.0.5',
					exposed_port: 8000,
				},
			];
		} else if (!this.state.arc && this.includedInOriginal('arc')) {
			body.remove_deployments = [...body.remove_deployments, 'arc'];
		}

		if (this.state.mirage && !this.includedInOriginal('mirage')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'mirage',
					image: 'appbaseio/mirage:0.10.1',
					exposed_port: 3030,
				},
			];
		} else if (!this.state.mirage && this.includedInOriginal('mirage')) {
			body.remove_deployments = [...body.remove_deployments, 'mirage'];
		}

		if (this.state.elasticsearchHQ && !this.includedInOriginal('elasticsearch-hq')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.4.1',
					exposed_port: 5000,
				},
			];
		} else if (!this.state.elasticsearchHQ && this.includedInOriginal('elasticsearch-hq')) {
			body.remove_deployments = [...body.remove_deployments, 'elasticsearch-hq'];
		}
		deployCluster(body, this.props.match.params.id)
			.then(() => {
				this.props.history.push('/clusters');
			})
			.catch((e) => {
				this.setState({
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

	renderClusterEndpoint = (source) => {
		if (Object.keys(source).length) {
			const username = source.username || source.dashboard_username;
			const password = source.password || source.dashboard_password;
			const [protocol, url] = (source.url || source.dashboard_url).split('://');
			return (
				<div key={source.name} className={clusterEndpoint}>
					<h4>
						<a
							href={`${protocol}://${username}:${password}@${url}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon type="link" theme="outlined" />
							{source.name}
						</a>
					</h4>
					<CredentialsBox name={source.name} text={`${username}:${password}`} />
				</div>
			);
		}

		return null;
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
				<FullHeader cluster={clusterId} />
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
										amount={19900}
										token={token => this.handleToken(clusterId, token)}
										disabled={false}
										stripeKey={STRIPE_KEY}
									>
										<Button
											size="large"
											ref={this.paymentButton}
											css={{
												marginRight: 12,
											}}
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

		return (
			<Fragment>
				<FullHeader isCluster cluster={this.props.match.params.id} />
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
											<div>{this.state.cluster.pricing_plan}</div>
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

								{this.state.cluster.status === 'deployments in progress' ? null : (
									<li className={card}>
										<div className="col light">
											<h3>Elasticsearch</h3>
											<p>Live cluster endpoint</p>

											{this.state.arc ? (
												<Link
													to={{
														pathname: `${
															this.props.match.params.id
														}/explore`,
														state: {
															arc: this.getAddon(
																'arc',
																this.originalCluster.deployment,
															),
														},
													}}
												>
													<Button type="primary" size="large">
														Explore Cluster
													</Button>
												</Link>
											) : null}
										</div>

										<div className="col">
											{Object.keys(this.state.deployment)
												.filter(item => item !== 'addons')
												.map(key => this.renderClusterEndpoint(
														this.state.deployment[key],
													))}
										</div>
									</li>
								)}

								{this.state.cluster.status === 'deployments in progress' ? null : (
									<li className={card}>
										<div className="col light">
											<h3>Dashboard</h3>
											<p>Manage your cluster</p>
										</div>

										<div className="col">
											{this.renderClusterEndpoint(this.state.cluster)}
										</div>
									</li>
								)}

								{this.state.cluster.status === 'deployments in progress' ? null : (
									<li className={card}>
										<div className="col light">
											<h3>Add-ons</h3>
											<p>Elasticsearch add-ons endpoint</p>
										</div>

										<div className="col">
											{(this.state.deployment.addons || []).map(key => this.renderClusterEndpoint(key))}
										</div>
									</li>
								)}

								{this.state.cluster.status === 'deployments in progress' ? null : (
									<li className={card}>
										<div className="col light">
											<h3>Edit Cluster Settings</h3>
											<p>Customise as per your needs</p>
										</div>
										<div className="col grow">
											<div className={settingsItem}>
												<h4>Kibana</h4>
												<div>
													<label htmlFor="yes">
														<input
															type="radio"
															name="kibana"
															defaultChecked={this.state.kibana}
															id="yes"
															onChange={() => this.setConfig('kibana', true)
															}
														/>
														Yes
													</label>

													<label htmlFor="no">
														<input
															type="radio"
															name="kibana"
															defaultChecked={!this.state.kibana}
															id="no"
															onChange={() => this.setConfig('kibana', false)
															}
														/>
														No
													</label>
												</div>
											</div>

											<div className={settingsItem}>
												<h4>Logstash</h4>
												<div>
													<label htmlFor="yes2">
														<input
															type="radio"
															name="logstash"
															defaultChecked={this.state.logstash}
															id="yes2"
															onChange={() => this.setConfig('logstash', true)
															}
														/>
														Yes
													</label>

													<label htmlFor="no2">
														<input
															type="radio"
															name="logstash"
															defaultChecked={!this.state.logstash}
															id="no2"
															onChange={() => this.setConfig('logstash', false)
															}
														/>
														No
													</label>
												</div>
											</div>

											<div className={settingsItem}>
												<h4>Add-ons</h4>
												<div className="settings-label">
													<label htmlFor="arc">
														<input
															type="checkbox"
															defaultChecked={this.state.arc}
															id="arc"
															onChange={() => this.toggleConfig('arc')
															}
														/>
														Arc Middleware
													</label>

													<label htmlFor="dejavu">
														<input
															type="checkbox"
															defaultChecked={this.state.dejavu}
															id="dejavu"
															onChange={() => this.toggleConfig('dejavu')
															}
														/>
														Dejavu
													</label>

													<label htmlFor="elasticsearchHQ">
														<input
															type="checkbox"
															defaultChecked={
																this.state.elasticsearchHQ
															}
															id="elasticsearchHQ"
															onChange={() => this.toggleConfig('elasticsearchHQ')
															}
														/>
														Elasticsearch-HQ
													</label>

													<label htmlFor="mirage">
														<input
															type="checkbox"
															defaultChecked={this.state.mirage}
															id="mirage"
															onChange={() => this.toggleConfig('mirage')
															}
														/>
														Mirage
													</label>
												</div>
											</div>
										</div>
									</li>
								)}
							</ul>

							{this.state.cluster.status === 'deployments in progress' ? (
								<div>
									<p style={{ textAlign: 'center' }}>
										Deployment is in progress. Please wait.
									</p>
									{this.renderClusterAbsentActionButtons()}
								</div>
							) : (
								<div className={clusterButtons}>
									<Button
										onClick={this.deleteCluster}
										type="danger"
										size="large"
										icon="delete"
										className="delete"
									>
										Delete Cluster
									</Button>

									<div>
										{
											this.props.location.search.startsWith('?subscribe=true')
												? (
													<Stripe
														name="Appbase.io Clusters"
														amount={19900}
														token={token => this.handleToken(this.props.match.params.id, token)}
														disabled={false}
														stripeKey={STRIPE_KEY}
													>
														<Button
															size="large"
															ref={this.paymentButton}
															css={{
																marginRight: 12,
															}}
														>
															Pay now
														</Button>
													</Stripe>
												)
												: null
										}
										<Button
											size="large"
											icon="save"
											type="primary"
											onClick={this.saveClusterSettings}
										>
											Save Cluster Settings
										</Button>
									</div>
								</div>
							)}
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}

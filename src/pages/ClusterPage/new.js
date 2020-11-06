import { Button, Col, Icon, Modal, Row, Select, Tabs, Tooltip } from 'antd';
import { get } from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Header from '../../batteries/components/shared/UpgradePlan/Header';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Loader from '../../components/Loader';
import PricingSlider from './components/PricingSlider';
import StripeCheckout from '../../components/StripeCheckout';
import { card, clusterContainer, esContainer, settingsItem } from './styles';
import {
	createSubscription,
	deployCluster,
	getClusters,
	hasAnsibleSetup,
	CLUSTER_PLANS,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
} from './utils';
import plugins from './utils/plugins';
import { regions, regionsByPlan } from './utils/regions';

const { Option } = Select;

const { TabPane } = Tabs;

const SSH_KEY =
	'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCVqOPpNuX53J+uIpP0KssFRZToMV2Zy/peG3wYHvWZkDvlxLFqGTikH8MQagt01Slmn+mNfHpg6dm5NiKfmMObm5LbcJ62Nk9AtHF3BPP42WyQ3QiGZCjJOX0fVsyv3w3eB+Eq+F+9aH/uajdI+wWRviYB+ljhprZbNZyockc6V33WLeY+EeRQW0Cp9xHGQUKwJa7Ch8/lRkNi9QE6n5W/T6nRuOvu2+ThhjiDFdu2suq3V4GMlEBBS6zByT9Ct5ryJgkVJh6d/pbocVWw99mYyVm9MNp2RD9w8R2qytRO8cWvTO/KvsAZPXj6nJtB9LaUtHDzxe9o4AVXxzeuMTzx siddharth@appbase.io';

const esVersions = ['7.9.3', '7.8.1', '7.8.0', '7.7.1'];

const odfeVersions = ['1.11.0', '1.9.0', '1.8.0'];

export const V7_ARC = '7.35.0-cluster';
export const V6_ARC = '7.35.0-cluster';
export const ARC_BYOC = '7.35.0-byoc';
export const V5_ARC = 'v5-0.0.1';

export const arcVersions = {
	7: V7_ARC,
	6: V6_ARC,
	5: V5_ARC,
	/* odfe versions start */
	0: V6_ARC,
	1: V7_ARC,
	/* odfe versions end */
};
export const machineMarks = {
	gke: {
		0: {
			label: 'Sandbox',
			plan: '2019-sandbox',
			storage: 30,
			memory: 4,
			nodes: 1,
			cpu: 2,
			cost: 49,
			machine: 'custom-2-4096',
			pph: 0.07,
		},
		20: {
			label: 'Hobby',
			plan: '2019-hobby',
			storage: 60,
			memory: 4,
			nodes: 2,
			cpu: 2,
			cost: 99,
			machine: 'custom-2-4096',
			pph: 0.14,
		},
		40: {
			label: 'Starter',
			plan: '2019-starter',
			storage: 120,
			memory: 4,
			nodes: 3,
			cpu: 2,
			cost: 149,
			machine: 'custom-2-4096',
			pph: 0.2,
		},
		60: {
			label: 'Production-I',
			plan: '2019-production-1',
			storage: 480,
			memory: 16,
			nodes: 3,
			cpu: 4,
			cost: 799,
			machine: 'n1-standard-4',
			pph: 1.11,
		},
		80: {
			label: 'Production-II',
			plan: '2019-production-2',
			storage: 999,
			memory: 32,
			nodes: 3,
			cpu: 8,
			cost: 1599,
			machine: 'n1-standard-8',
			pph: 2.22,
		},
		100: {
			label: 'Production-III',
			plan: '2019-production-3',
			storage: 2997,
			memory: 64,
			nodes: 3,
			cpu: 16,
			cost: 3199,
			pph: 4.44,
		},
	},
};
export const ansibleMachineMarks = {
	aws: {
		0: {
			label: 'Sandbox',
			plan: '2020-sandbox',
			storage: 30,
			memory: 4,
			nodes: 1,
			cpu: 2,
			cost: 49,
			machine: 't3.medium',
			pph: 0.07,
		},
		20: {
			label: 'Hobby',
			plan: '2020-hobby',
			storage: 60,
			memory: 4,
			nodes: 2,
			cpu: 2,
			cost: 99,
			machine: 't3.medium',
			pph: 0.14,
		},
		40: {
			label: 'Starter',
			plan: '2020-starter',
			storage: 120,
			memory: 4,
			nodes: 3,
			cpu: 2,
			cost: 149,
			machine: 't3.medium',
			pph: 0.21,
		},
		60: {
			label: 'Production-I',
			plan: '2019-production-1',
			storage: 480,
			memory: 16,
			nodes: 3,
			cpu: 4,
			cost: 799,
			machine: 't3.xlarge',
			pph: 1.11,
		},
		80: {
			label: 'Production-II',
			plan: '2019-production-2',
			storage: 999,
			memory: 32,
			nodes: 3,
			cpu: 8,
			cost: 1599,
			machine: 't3.2xlarge',
			pph: 2.22,
		},
		100: {
			label: 'Production-III',
			plan: '2019-production-3',
			storage: 2997,
			memory: 64,
			nodes: 3,
			cpu: 16,
			cost: 3199,
			machine: 'm5a.4xlarge',
			pph: 4.44,
		},
	},
	gke: {
		0: {
			label: 'Sandbox',
			plan: '2020-sandbox',
			storage: 30,
			memory: 4,
			nodes: 1,
			cpu: 2,
			cost: 49,
			machine: 'custom-2-4096',
			pph: 0.07,
		},
		20: {
			label: 'Hobby',
			plan: '2020-hobby',
			storage: 60,
			memory: 4,
			nodes: 2,
			cpu: 2,
			cost: 99,
			machine: 'custom-2-4096',
			pph: 0.14,
		},
		40: {
			label: 'Starter',
			plan: '2020-starter',
			storage: 120,
			memory: 4,
			nodes: 3,
			cpu: 2,
			cost: 149,
			machine: 'custom-2-4096',
			pph: 0.21,
		},
		60: {
			label: 'Production-I',
			plan: '2019-production-1',
			storage: 480,
			memory: 16,
			nodes: 3,
			cpu: 4,
			cost: 799,
			machine: 'e2-standard-4',
			pph: 1.11,
		},
		80: {
			label: 'Production-II',
			plan: '2019-production-2',
			storage: 999,
			memory: 32,
			nodes: 3,
			cpu: 8,
			cost: 1599,
			machine: 'e2-standard-8',
			pph: 2.22,
		},
		100: {
			label: 'Production-III',
			plan: '2019-production-3',
			storage: 2997,
			memory: 64,
			nodes: 3,
			cpu: 16,
			cost: 3199,
			machine: 'e2-standard-16',
			pph: 4.44,
		},
	},
};

const validOpenFaasPlans = [
	// CLUSTER_PLANS.PRODUCTION_2019_3,
	// CLUSTER_PLANS.PRODUCTION_2019_2,
	// CLUSTER_PLANS.PRODUCTION_2019_1,
];

const namingConvention = `Name must start with a lowercase letter followed by upto 31 lowercase letters, numbers or hyphens and cannot end with a hyphen.`;

class NewCluster extends Component {
	constructor(props) {
		super(props);

		const pluginState = {};
		Object.keys(plugins).forEach(item => {
			pluginState[item] = item !== 'x-pack';
		});

		const provider = 'gke';

		this.state = {
			isLoading: false,
			clusterName: '',
			clusterVersion: esVersions[0],
			pricing_plan: get(ansibleMachineMarks, `${provider}[0].plan`),
			vm_size: get(ansibleMachineMarks, `${provider}[0].machine`),
			region: '',
			kibana: false,
			streams: false,
			elasticsearchHQ: true,
			arc: true,
			error: '',
			clusters: [],
			deploymentError: '',
			restore_from: null,
			showError: false,
			isClusterLoading: true,
			esFlavor: 'es',
			provider,
			visualization: 'none',
			isStripeCheckoutOpen: false,
			...pluginState,
		};
	}

	componentDidMount() {
		getClusters()
			.then(clusters => {
				if (window.Intercom) {
					window.Intercom('update', {
						total_clusters: clusters.length,
						trial_end_date: moment
							.unix(this.props.clusterTrialEndDate)
							.toDate(),
					});
				}
				const activeClusters = clusters.filter(
					item => item.status === 'active' && item.role === 'admin',
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

	componentDidUpdate(_, prevState) {
		const { provider } = this.state;
		if (prevState.provider !== provider) {
			const [currentMachine] = Object.entries(
				get(ansibleMachineMarks, `${prevState.provider}`),
			).find(([, value]) => value.machine === prevState.vm_size);
			// eslint-disable-next-line
			this.setState({
				pricing_plan: get(
					ansibleMachineMarks,
					`${provider}.${currentMachine}.plan`,
				),
				vm_size: get(
					ansibleMachineMarks,
					`${provider}.${currentMachine}.machine`,
				),
				region: '',
			});
		}
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	setPricing = plan => {
		this.setState({
			vm_size: plan.machine,
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

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleStripeSubmit = data => {
		this.createCluster(data);
		this.setState({
			isStripeCheckoutOpen: false,
		});
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

			const selectedMachine = Object.values(
				ansibleMachineMarks[this.state.provider],
			).find(item => item.plan === this.state.pricing_plan);

			const arcTag =
				arcVersions[this.state.clusterVersion.split('.')[0]] ||
				arcVersions['6'];

			const body = {
				elasticsearch: {
					nodes: selectedMachine.nodes,
					version: this.state.clusterVersion,
					volume_size:
						selectedMachine.storage / selectedMachine.nodes,
					plugins: Object.keys(plugins).filter(
						item => this.state[item],
					),
					restore_from: this.state.restore_from,
					odfe: parseInt(this.state.clusterVersion, 10) < 5,
				},
				cluster: {
					name: this.state.clusterName,
					location: this.state.region,
					vm_size: this.state.vm_size,
					pricing_plan: this.state.pricing_plan,
					ssh_public_key: SSH_KEY,
					provider: this.state.provider,
				},
				addons: [
					{
						name: 'elasticsearch-hq',
						image: 'elastichq/elasticsearch-hq:release-v3.5.0',
						exposed_port: 5000,
					},
					{
						name: 'arc',
						image: `siddharthlatest/arc:${arcTag}`,
						exposed_port: 8000,
					},
				],
			};

			if (validOpenFaasPlans.indexOf(this.state.pricing_plan) > -1) {
				body.open_faas = true;
			}

			if (this.state.visualization === 'kibana') {
				body.kibana = {
					create_node: false,
					version: this.state.clusterVersion,
					odfe: parseInt(this.state.clusterVersion, 10) < 5,
				};
			}

			if (this.state.visualization === 'grafana') {
				body.grafana = true;
			}

			if (stripeData.token) {
				body.enable_monitoring = true;
			}

			this.setState({
				isLoading: true,
			});

			const clusterRes = await deployCluster(body);
			if (stripeData.token) {
				await createSubscription({
					clusterId: clusterRes.cluster.id,
					...stripeData,
				});
			}
			this.props.history.push('/');
		} catch (e) {
			this.setState({
				isLoading: false,
				deploymentError: e,
				showError: true,
			});
		}
	};

	renderPlugins = () => (
		<div className={card}>
			<div className="col light">
				<h3> Edit Cluster Plugins </h3>
				<p> Add or remove cluster plugins </p>
			</div>
			<div className="col grow">
				{Object.keys(plugins).map(plugin => (
					<div key={plugin} className={`${settingsItem} grow`}>
						<h4> {plugins[plugin]} </h4>
						<div>
							<label htmlFor={`${plugin}-yes`}>
								<input
									type="radio"
									name={plugin}
									defaultChecked={this.state[plugin]}
									id={`${plugin}-yes`}
									onChange={() =>
										this.setConfig(plugin, true)
									}
								/>
								Yes
							</label>
							<label htmlFor={`${plugin}-no`}>
								<input
									type="radio"
									name={plugin}
									defaultChecked={!this.state[plugin]}
									id={`${plugin}-no`}
									onChange={() =>
										this.setConfig(plugin, false)
									}
								/>
								No
							</label>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	renderRegions = () => {
		const { provider, pricing_plan: pricingPlan } = this.state;
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
						<span> {regionValue.name} </span>
					</li>
				);
			});

		const style = {
			width: '100%',
		};
		if (provider === 'azure') {
			return (
				<ul style={style} className="region-list">
					{regionsToRender(Object.keys(regions[provider]))}
				</ul>
			);
		}

		return (
			<Tabs size="large" style={style}>
				{usRegions.length > 0 && (
					<TabPane tab="America" key="america">
						<ul className="region-list">
							{regionsToRender(usRegions)}
						</ul>
					</TabPane>
				)}
				{asiaRegions.length > 0 && (
					<TabPane tab="Asia" key="asia">
						<ul className="region-list">
							{regionsToRender(asiaRegions)}
						</ul>
					</TabPane>
				)}
				{euRegions.length > 0 && (
					<TabPane tab="Europe" key="europe">
						<ul className="region-list">
							{regionsToRender(euRegions)}
						</ul>
					</TabPane>
				)}
				{otherRegions.length > 0 && (
					<TabPane tab="Other Regions" key="other">
						<ul className="region-list">
							{regionsToRender(otherRegions)}
						</ul>
					</TabPane>
				)}
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

	render() {
		const { provider, isLoading, clusters } = this.state;
		const { isUsingClusterTrial } = this.props;

		const isInvalid = !this.validateClusterName();
		if (isLoading) return <Loader />;
		const versions =
			this.state.esFlavor === 'odfe' ? odfeVersions : esVersions;
		const defaultVersion = this.state.clusterVersion;

		const activeClusters = clusters.filter(
			cluster => cluster.status === 'active',
		);
		return (
			<Fragment>
				<FullHeader clusters={activeClusters} isCluster />
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col md={18}>
							<h2> Create a New Cluster </h2>
							<Row>
								<Col span={18}>
									<p>
										Create a new ElasticSearch Cluster with
										appbase.io.
										<a
											href="https://docs.appbase.io"
											rel="noopener noreferrer"
											target="_blank"
										>
											Learn More
										</a>
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
							<Tooltip title="Do you already have an externally hosted ElasticSearch Cluster? You can use it alongside appbase.io and get a better security, analytics, and  development experience.">
								<Button
									size="large"
									type="primary"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() =>
										this.props.history.push(
											'/clusters/new/my-cluster',
										)
									}
									icon="question-circle"
								>
									Already have a Cluster
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
							onCancel={this.handleStripeModal}
							onSubmit={this.handleStripeSubmit}
						/>
					)}
					<section className={clusterContainer}>
						{this.state.showError ? this.handleError() : null}
						<article>
							<div className={card}>
								<div className="col light">
									<h3> Pick the pricing plan </h3>
									<p> Scale as you go </p>
								</div>
								<PricingSlider
									key={this.state.provider}
									marks={
										ansibleMachineMarks[this.state.provider]
									}
									onChange={this.setPricing}
								/>
							</div>
							{!isUsingClusterTrial && (
								<div className={card}>
									<div className="col light">
										<h3> Pick the provider </h3>
									</div>
									<div
										className={settingsItem}
										css={{
											padding: 30,
										}}
									>
										<Button
											type={
												provider === 'gke'
													? 'primary'
													: 'default'
											}
											size="large"
											css={{
												height: 160,
												marginRight: 20,
												backgroundColor:
													provider === 'gke'
														? '#eaf5ff'
														: '#fff',
											}}
											onClick={() =>
												this.setConfig(
													'provider',
													'gke',
												)
											}
										>
											<img
												width="120"
												src="/static/images/clusters/google.png"
												alt="Google"
											/>
										</Button>
										<Button
											size="large"
											type={
												provider === 'aws'
													? 'primary'
													: 'default'
											}
											css={{
												height: 160,
												backgroundColor:
													provider === 'aws'
														? '#eaf5ff'
														: '#fff',
											}}
											onClick={() =>
												this.setConfig(
													'provider',
													'aws',
												)
											}
										>
											<img
												width="120"
												src="/static/images/clusters/aws.png"
												alt="aws"
											/>
										</Button>
									</div>
								</div>
							)}
							<div className={card}>
								<div className="col light">
									<h3> Pick a region </h3>
									<p> All around the globe </p>
								</div>
								<div className="col grow region-container">
									{this.renderRegions()}
								</div>
							</div>
							<div className={card}>
								<div className="col light">
									<h3> Choose a cluster name </h3>
									<p>
										Name your cluster.A name is permanent.
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
										{namingConvention}
									</p>
								</div>
							</div>
							<div className={card}>
								<div className="col light">
									<h3> Choose Elasticsearch Flavor </h3>
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
												this.state.esFlavor === 'es'
													? 'primary'
													: 'default'
											}
											size="large"
											css={{
												height: 160,
												marginRight: 20,
												backgroundColor:
													this.state.esFlavor === 'es'
														? '#eaf5ff'
														: '#fff',
											}}
											onClick={() => {
												this.setConfig(
													'esFlavor',
													'es',
												);
												this.setConfig(
													'clusterVersion',
													esVersions[0],
												);
											}}
										>
											<img
												width="150"
												src="https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt05047fdbe3b9c333/5c11ec1f3312ce2e785d9c30/logo-elastic-elasticsearch-lt.svg"
												alt="Elastic"
											/>
										</Button>
										<p>
											The Open Source Elasticsearch
											Distribution.
										</p>
									</div>
									<div className={esContainer}>
										<Button
											size="large"
											type={
												this.state.esFlavor === 'odfe'
													? 'primary'
													: 'default'
											}
											css={{
												height: 160,
												backgroundColor:
													this.state.esFlavor ===
													'odfe'
														? '#eaf5ff'
														: '#fff',
											}}
											onClick={() => {
												this.setConfig(
													'esFlavor',
													'odfe',
												);
												this.setConfig(
													'clusterVersion',
													odfeVersions[0],
												);
											}}
										>
											<img
												width="150"
												src="/static/images/clusters/odfe.svg"
												alt="ODFE"
											/>
										</Button>
										<p>
											Open Distro by Amazon, includes
											additional security enhancements.
										</p>
									</div>
								</div>
							</div>
							<div className={card}>
								<div className="col light">
									<h3> Additional Settings </h3>
									<p> Customise as per your needs </p>
								</div>
								<div className="col grow">
									<div className={settingsItem}>
										<h4
											style={{
												marginLeft: -20,
												fontWeight: 'normal',
												color: 'rgba(0, 0, 0, 0.65)',
											}}
										>
											Select a version
										</h4>
										<select
											className="form-control"
											onChange={e =>
												this.setConfig(
													'clusterVersion',
													e.target.value,
												)
											}
										>
											{versions.map(version => (
												<option
													key={version}
													value={version}
													defaultChecked={
														defaultVersion ===
														version
													}
												>
													{version}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>
							<div className={card}>
								<div className="col light">
									<h3> Choose Visualization Tool </h3>
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
												this.state.visualization ===
												'none'
													? 'primary'
													: 'default'
											}
											size="large"
											css={{
												height: 160,
												width: '100%',
												color: '#000',
												backgroundColor:
													this.state.visualization ===
													'none'
														? '#eaf5ff'
														: '#fff',
											}}
											onClick={() => {
												this.setConfig(
													'visualization',
													'none',
												);
											}}
										>
											None
										</Button>
									</div>
									<div className={esContainer}>
										<Button
											size="large"
											type={
												this.state.visualization ===
												'kibana'
													? 'primary'
													: 'default'
											}
											css={{
												height: 160,
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
											}}
										>
											<img
												width={150}
												src="https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt8781708f8f37ed16/5c11ec2edf09df047814db23/logo-elastic-kibana-lt.svg"
												alt="Kibana"
											/>
										</Button>
										<p>
											The default visualization dashboard
											for ElasticSearch.
										</p>
									</div>
									{!hasAnsibleSetup(
										this.state.pricing_plan,
									) && (
										<div className={esContainer}>
											<Button
												size="large"
												type={
													this.state.visualization ===
													'grafana'
														? 'primary'
														: 'default'
												}
												css={{
													height: 160,
													width: '100%',
													backgroundColor:
														this.state
															.visualization ===
														'grafana'
															? '#eaf5ff'
															: '#fff',
												}}
												onClick={() => {
													this.setConfig(
														'visualization',
														'grafana',
													);
												}}
											>
												<img
													width={120}
													src="/static/images/clusters/grafana.png"
													alt="Grafana"
												/>
											</Button>
											<p>
												The leading open - source tool
												for metrics visualization.
											</p>
										</div>
									)}
								</div>
							</div>
							{/* this.renderPlugins() */}
							<div className={card}>
								<div className="col light">
									<h3> Restore a cluster data </h3>
									<p>
										Select the cluster from which you want
										to restore the latest snapshot from.
									</p>
								</div>
								<div className="col grow vcenter">
									<Select
										css={{
											width: '100%',
											maxWidth: 400,
										}}
										placeholder="Select a cluster"
										onChange={this.handleCluster}
									>
										{this.state.clusters.map(item => (
											<Option key={item.id}>
												{item.name}
											</Option>
										))}
									</Select>
								</div>
							</div>
							<div
								style={{
									textAlign: 'right',
									marginBottom: 40,
								}}
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
										CLUSTER_PLANS.SANDBOX_2020) ||
								clusters.length > 0 ? (
									<Button
										type="primary"
										size="large"
										disabled={
											!this.validateClusterName() ||
											!this.state.region
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
	clusterTrialEndDate: get(state, '$getUserPlan.cluster_tier_validity') || 0,
});
NewCluster.propTypes = {
	isUsingClusterTrial: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired,
	clusterTrialEndDate: PropTypes.number,
};
export default connect(mapStateToProps, null)(NewCluster);

import {
	ArrowRightOutlined,
	InfoCircleOutlined,
	InfoCircleTwoTone,
} from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Tabs, Tooltip, Alert } from 'antd';
import { get } from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { generateSlug } from 'random-word-slugs';
import Header from '../../batteries/components/shared/UpgradePlan/Header';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Loader from '../../components/Loader';
import PricingSlider from './components/PricingSlider';
import StripeCheckout from '../../components/StripeCheckout';
import {
	card,
	clusterContainer,
	esContainer,
	settingsItem,
	fadeOutStyles,
} from './styles';
import {
	createSubscription,
	deployCluster,
	getClusters,
	CLUSTER_PLANS,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
	getDistance,
} from './utils';
import plugins from './utils/plugins';
import { regions, regionsByPlan } from './utils/regions';

const { Option } = Select;

const { TabPane } = Tabs;

const SSH_KEY =
	'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCVqOPpNuX53J+uIpP0KssFRZToMV2Zy/peG3wYHvWZkDvlxLFqGTikH8MQagt01Slmn+mNfHpg6dm5NiKfmMObm5LbcJ62Nk9AtHF3BPP42WyQ3QiGZCjJOX0fVsyv3w3eB+Eq+F+9aH/uajdI+wWRviYB+ljhprZbNZyockc6V33WLeY+EeRQW0Cp9xHGQUKwJa7Ch8/lRkNi9QE6n5W/T6nRuOvu2+ThhjiDFdu2suq3V4GMlEBBS6zByT9Ct5ryJgkVJh6d/pbocVWw99mYyVm9MNp2RD9w8R2qytRO8cWvTO/KvsAZPXj6nJtB9LaUtHDzxe9o4AVXxzeuMTzx siddharth@appbase.io';

const esVersions = ['8.7.1', '7.17.9'];

const openSearchVersions = ['2.7.0'];

let interval;

export const V7_ARC = '8.12.1-cluster';
export const V6_ARC = '8.12.1-cluster';
export const ARC_BYOC = '8.12.1-byoc';
export const V5_ARC = 'v5-0.0.1';
export const REACTIVESEARCH_BYOC = '8.12.1-byoc';

export const arcVersions = {
	7: V7_ARC,
	6: V6_ARC,
	5: V5_ARC,
	/* odfe versions start */
	0: V6_ARC,
	1: V7_ARC,
	/* odfe versions end */
};

export const ansibleMachineMarks = {
	[CLUSTER_PLANS.SANDBOX_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.SANDBOX_2020],
		plan: CLUSTER_PLANS.SANDBOX_2020,
		storage: 30,
		memory: 4,
		nodes: 1,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 30,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.SANDBOX_2020],
	},
	[CLUSTER_PLANS.HOBBY_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.HOBBY_2020],
		plan: CLUSTER_PLANS.HOBBY_2020,
		storage: 60,
		memory: 4,
		nodes: 2,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.HOBBY_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 30,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.HOBBY_2020],
	},
	[CLUSTER_PLANS.STARTER_2020]: {
		label: PLAN_LABEL[CLUSTER_PLANS.STARTER_2020],
		plan: CLUSTER_PLANS.STARTER_2020,
		storage: 120,
		memory: 4,
		nodes: 3,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2020],
		gkeMachine: 'e2-medium',
		awsMachine: 't3.medium',
		storagePerNode: 40,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2020],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_1]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_1],
		plan: CLUSTER_PLANS.PRODUCTION_2019_1,
		storage: 480,
		memory: 16,
		nodes: 3,
		cpu: 4,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_1],
		gkeMachine: 'e2-standard-4',
		awsMachine: 't3.xlarge',
		storagePerNode: 160,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_1],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_2]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_2],
		plan: CLUSTER_PLANS.PRODUCTION_2019_2,
		storage: 999,
		memory: 32,
		nodes: 3,
		cpu: 8,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_2],
		gkeMachine: 'e2-standard-8',
		awsMachine: 't3.2xlarge',
		storagePerNode: 333,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_2],
	},
	[CLUSTER_PLANS.PRODUCTION_2019_3]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2019_3],
		plan: CLUSTER_PLANS.PRODUCTION_2019_3,
		storage: 2997,
		memory: 64,
		nodes: 3,
		cpu: 16,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_3],
		gkeMachine: 'e2-standard-16',
		awsMachine: 'm5a.4xlarge',
		storagePerNode: 999,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2019_3],
	},
	[CLUSTER_PLANS.STARTER_2021]: {
		label: PLAN_LABEL[CLUSTER_PLANS.STARTER_2021],
		plan: CLUSTER_PLANS.STARTER_2021,
		storage: 240,
		memory: 8,
		nodes: 3,
		cpu: 2,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2021],
		gkeMachine: 'e2-standard-2',
		awsMachine: 't3.large',
		storagePerNode: 80,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.STARTER_2021],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_1]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_1],
		plan: CLUSTER_PLANS.PRODUCTION_2021_1,
		storage: 480,
		memory: 16,
		nodes: 3,
		cpu: 4,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_1],
		gkeMachine: 'e2-standard-4',
		awsMachine: 't3.xlarge',
		storagePerNode: 160,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_1],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_2]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_2],
		plan: CLUSTER_PLANS.PRODUCTION_2021_2,
		storage: 999,
		memory: 32,
		nodes: 3,
		cpu: 8,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_2],
		gkeMachine: 'e2-standard-8',
		awsMachine: 't3.2xlarge',
		storagePerNode: 333,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_2],
	},
	[CLUSTER_PLANS.PRODUCTION_2021_3]: {
		label: PLAN_LABEL[CLUSTER_PLANS.PRODUCTION_2021_3],
		plan: CLUSTER_PLANS.PRODUCTION_2021_3,
		storage: 2997,
		memory: 64,
		nodes: 3,
		cpu: 16,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_3],
		gkeMachine: 'e2-standard-16',
		awsMachine: 'm5a.4xlarge',
		storagePerNode: 999,
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.PRODUCTION_2021_3],
	},

	[CLUSTER_PLANS.CLUSTER_SLS_HOBBY]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		plan: CLUSTER_PLANS.CLUSTER_SLS_HOBBY,
		storage: 1,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_HOBBY],
	},
	[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		plan: CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION,
		storage: 10,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_PRODUCTION],
	},
	[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE]: {
		label: PLAN_LABEL[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		plan: CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE,
		storage: 10,
		cost: PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
		pph: EFFECTIVE_PRICE_BY_PLANS[CLUSTER_PLANS.CLUSTER_SLS_ENTERPRISE],
	},
};

export const machineMarks = {
	0: ansibleMachineMarks[CLUSTER_PLANS.SANDBOX_2020],
	20: ansibleMachineMarks[CLUSTER_PLANS.HOBBY_2020],
	40: ansibleMachineMarks[CLUSTER_PLANS.STARTER_2021],
	60: ansibleMachineMarks[CLUSTER_PLANS.PRODUCTION_2021_1],
	80: ansibleMachineMarks[CLUSTER_PLANS.PRODUCTION_2021_2],
	100: ansibleMachineMarks[CLUSTER_PLANS.PRODUCTION_2021_3],
};

export const regionsKeyMap = {
	asia: 'asia',
	eu: 'europe',
	us: 'america',
	other: 'other',
};

const validOpenFaasPlans = [
	// CLUSTER_PLANS.PRODUCTION_2019_3,
	// CLUSTER_PLANS.PRODUCTION_2019_2,
	// CLUSTER_PLANS.PRODUCTION_2019_1,
];

const namingConvention = `Name must start with a lowercase letter followed by upto 21 lowercase letters, numbers or hyphens and cannot end with a hyphen.`;

class NewCluster extends Component {
	constructor(props) {
		super(props);

		const pluginState = {};
		Object.keys(plugins).forEach(item => {
			pluginState[item] = item !== 'x-pack';
		});

		const provider = 'gke';
		const pricing_plan = CLUSTER_PLANS.SANDBOX_2020;

		this.state = {
			isLoading: false,
			clusterName: '',
			changed: false,
			clusterVersion: openSearchVersions[0],
			pricing_plan,
			vm_size: get(
				ansibleMachineMarks[pricing_plan],
				`${provider}Machine`,
			),
			region: 'us-central1',
			vm_machine: 0,
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
			esFlavor: 'opensearch',
			provider,
			visualization: 'none',
			isStripeCheckoutOpen: false,
			activeKey: 'america',
			pingTimeStatus: {
				time: 0,
				isLoading: true,
			},
			...pluginState,
		};
	}

	componentDidMount() {
		this.getDefaultLocation();

		const slug = generateSlug(2);
		this.setState({
			clusterName: slug,
		});

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

	getPingTime = region => {
		const { provider } = this.state;
		let url = '';
		if (provider === 'gke') {
			url = `https://${region}-ezn5kimndq-${regions[provider][region].code2}.a.run.app/ping`;
		} else {
			url = `https://ec2.${region}.amazonaws.com/ping?cache_buster=${Date.now()}`;
		}

		let counter = 1;
		let total = 0;
		interval = setInterval(() => {
			if (counter > 15) {
				this.setState({
					pingTimeStatus: {
						time: Math.round(total / 3),
						isLoading: false,
					},
				});
				clearInterval(interval);
			} else {
				this.checkResponseTime(url)
					.then(res => {
						this.setState({
							pingTimeStatus: {
								time: Math.round(res),
								isLoading: true,
							},
						});
						if (counter > 12) {
							total += res;
						}
					})
					.catch(err => {
						console.error(err);
					})
					.finally(() => {
						counter += 1;
					});
			}
		}, 2000);
	};

	checkResponseTime = async url => {
		const time1 = performance.now();
		await fetch(url, { method: 'GET', mode: 'no-cors' });
		return performance.now() - time1;
	};

	getDefaultLocation = async () => {
		const { provider } = this.state;
		fetch(`https://geolocation-db.com/json/`)
			.then(res => res.json())
			.then(json => {
				if (json.latitude && json.longitude) {
					const providerRegions = Object.values(regions[provider]);
					let minDist = {
						...providerRegions[0],
						dist: Number.MAX_SAFE_INTEGER,
					};

					// eslint-disable-next-line no-restricted-syntax
					for (const [key, value] of Object.entries(
						regions[provider],
					)) {
						const distance = getDistance(
							json.latitude,
							json.longitude,
							value.lat,
							value.lon,
						);
						if (minDist.dist > distance) {
							minDist = {
								dist: distance,
								name: key,
								activeKey: regionsKeyMap[value.continent],
							};
						}
					}
					if (interval) clearInterval(interval);
					this.getPingTime(minDist.name);

					this.setState({
						region: minDist.name,
						activeKey: minDist.activeKey,
					});
				} else {
					this.setState({
						region: 'us-central1',
						activeKey: 'america',
					});
				}
			})
			.catch(err => console.error(err));
	};

	handleProviderChange = provider => {
		this.setState(currentState => {
			if (currentState.provider !== provider) {
				return {
					provider,
					vm_size: get(
						ansibleMachineMarks[currentState.pricing_plan],
						`${provider}Machine`,
					),
					region: provider === 'gke' ? 'us-central1' : 'us-east-1',
				};
			}

			return currentState;
		});
	};

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	setPricing = (plan, machine) => {
		const { provider } = this.state;
		this.setState({
			vm_size: get(plan, `${provider}Machine`),
			pricing_plan: plan.plan,
			vm_machine: machine,
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

	setActiveKey = key => {
		this.setState({
			activeKey: key,
		});
	};

	createCluster = async (stripeData = {}) => {
		try {
			if (!this.validateClusterName()) {
				// prettier-ignore
				const errorMessage = 'Name must start with a lowercase letter followed by upto 21 lowercase letters, numbers or hyphens and cannot end with a hyphen.';
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

			const selectedMachine =
				ansibleMachineMarks[this.state.pricing_plan];

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
					odfe: false,
					opensearch: this.state.esFlavor === 'opensearch',
				},
				cluster: {
					name: this.state.clusterName,
					location: this.state.region,
					vm_size: this.state.vm_size,
					pricing_plan: this.state.pricing_plan,
					ssh_public_key: SSH_KEY,
					provider: this.state.provider,
					is_multi_zone: false,
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
					odfe: false,
				};
			}

			if (this.state.visualization === 'grafana') {
				body.grafana = true;
			}

			if (this.state.visualization === 'opensearch') {
				body.elasticsearch.opensearch_dashboard = true;
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
		const {
			provider,
			pricing_plan: pricingPlan,
			activeKey,
			pingTimeStatus,
		} = this.state;
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

		const regionsToRender = data => (
			<>
				<div className="region-list">
					{data.map(region => {
						const regionValue = regions[provider][region];
						const isDisabled = allowedRegions
							? !allowedRegions.includes(region)
							: false;
						return (
							// eslint-disable-next-line
							<li
								key={region}
								onClick={() => {
									this.setConfig('region', region);
									this.setConfig('pingTimeStatus', {
										time: 0,
										isLoading: true,
									});
									if (interval) clearInterval(interval);
									this.getPingTime(region);
								}}
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
					})}
				</div>
				<div className="ping-time-container">
					{pingTimeStatus.time ? (
						<>
							Expected ping latency for{' '}
							{regions[provider][this.state.region].name} (
							{this.state.region}) from your location is:&nbsp;
							<div>{pingTimeStatus.time}ms </div>
							{pingTimeStatus.isLoading ? (
								<img
									src="https://cloud.headwayapp.co/changelogs_images/images/big/000/016/393-90c8090df0a63e76991bc6aae7b46c87d8cdb51e.gif"
									alt="hotspot_pulse-1.gif"
									width="35"
									height="35"
								/>
							) : null}
						</>
					) : null}
				</div>
			</>
		);

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
			<Tabs
				size="large"
				style={style}
				activeKey={activeKey}
				onChange={key => this.setActiveKey(key)}
			>
				{usRegions.length > 0 && (
					<TabPane tab="America" key="america">
						<ul className="regions-list-container">
							{regionsToRender(usRegions)}
						</ul>
					</TabPane>
				)}
				{asiaRegions.length > 0 && (
					<TabPane tab="Asia" key="asia">
						<ul className="regions-list-container">
							{regionsToRender(asiaRegions)}
						</ul>
					</TabPane>
				)}
				{euRegions.length > 0 && (
					<TabPane tab="Europe" key="europe">
						<ul className="regions-list-container">
							{regionsToRender(euRegions)}
						</ul>
					</TabPane>
				)}
				{otherRegions.length > 0 && (
					<TabPane tab="Other Regions" key="other">
						<ul className="regions-list-container">
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
		const {
			provider,
			isLoading,
			clusters,
			clusterName,
			changed,
			pricing_plan,
		} = this.state;
		const { isUsingClusterTrial } = this.props;

		if (isLoading) return <Loader />;
		const versions =
			this.state.esFlavor === 'opensearch'
				? openSearchVersions
				: esVersions;
		const defaultVersion = this.state.clusterVersion;

		const activeClusters = clusters.filter(
			cluster => cluster.status === 'active',
		);

		const pricingPlanArr = pricing_plan.split('-').slice(1);

		return (
			<Fragment>
				<FullHeader clusters={activeClusters} isCluster />
				<Header compact style={{ padding: '0 50px' }}>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col md={18}>
							<h2> Create a New Cluster </h2>
							<Row>
								<Col span={18}>
									<p>
										Create a new Elasticsearch or OpenSearch
										cluster{' '}
										<a
											href="https://docs.reactivesearch.io/docs/hosting/clusters/"
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
								display: 'none',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Tooltip title="Serverless search is a geo-distributed search index, takes 1 min to get up and running">
								<Button
									size="large"
									type="default"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => {
										if (interval) clearInterval(interval);
										this.props.history.push(
											'/new/serverless-search',
										);
									}}
									icon={<InfoCircleOutlined />}
								>
									Go to Serverless Search instead
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
					{isUsingClusterTrial && this.state.vm_machine ? (
						<Alert
							type="warning"
							message={`We only support Sandbox plan for a free trial. Creating a ${pricingPlanArr.join(
								'-',
							)} plan cluster will require adding a payment method`}
							showIcon
							size="small"
							style={{
								marginBottom: 10,
							}}
						/>
					) : null}
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
									marks={machineMarks}
									onChange={this.setPricing}
									showNoCardNeeded={
										isUsingClusterTrial &&
										this.state.clusters.length < 1
									}
									currValue={this.state.vm_machine}
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
											style={{
												height: '160px',
												marginRight: 20,
												backgroundColor:
													provider === 'gke'
														? '#eaf5ff'
														: '#fff',
											}}
											className={
												provider === 'gke'
													? fadeOutStyles
													: ''
											}
											onClick={() => {
												this.handleProviderChange(
													'gke',
												);
												this.setConfig(
													'pingTimeStatus',
													{
														time: 0,
														isLoading: true,
													},
												);
												if (interval)
													clearInterval(interval);
												this.getPingTime(
													this.state.region,
												);
											}}
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
											style={{
												height: '160px',
												backgroundColor:
													provider === 'aws'
														? '#eaf5ff'
														: '#fff',
											}}
											className={
												provider === 'aws'
													? fadeOutStyles
													: ''
											}
											onClick={() => {
												this.handleProviderChange(
													'aws',
												);
												this.setConfig(
													'pingTimeStatus',
													{
														time: 0,
														isLoading: true,
													},
												);
												if (interval)
													clearInterval(interval);
												this.getPingTime(
													this.state.region,
												);
											}}
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
											height: '160px',
											width: '100%',
											maxWidth: 400,
											marginBottom: 10,
											outline: 'none',
											border: '1px solid #40a9ff',
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
									<p style={{ color: 'inherit' }}>
										{namingConvention}
									</p>
								</div>
							</div>
							<div className={card}>
								<div className="col light">
									<h3> Choose Search Engine </h3>
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
											size="large"
											type={
												this.state.esFlavor ===
												'opensearch'
													? 'primary'
													: 'default'
											}
											style={{
												height: '160px',
												backgroundColor:
													this.state.esFlavor ===
													'opensearch'
														? '#eaf5ff'
														: '#fff',
											}}
											className={
												this.state.esFlavor ===
												'opensearch'
													? fadeOutStyles
													: ''
											}
											onClick={() => {
												this.setConfig(
													'esFlavor',
													'opensearch',
												);
												this.setConfig(
													'clusterVersion',
													openSearchVersions[0],
												);
											}}
										>
											<img
												width="150"
												src="https://opensearch.org/assets/brand/SVG/Logo/opensearch_logo_default.svg"
												alt="Open Search"
											/>
										</Button>
										<p>OpenSearch</p>
									</div>
									<div className={esContainer}>
										<Button
											type={
												this.state.esFlavor === 'es'
													? 'primary'
													: 'default'
											}
											size="large"
											style={{
												height: '160px',
												marginRight: 20,
												backgroundColor:
													this.state.esFlavor === 'es'
														? '#eaf5ff'
														: '#fff',
											}}
											className={
												this.state.esFlavor === 'es'
													? fadeOutStyles
													: ''
											}
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
										<p>Elasticsearch by Elastic</p>
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
								<div>
									<div
										className={settingsItem}
										css={{
											padding: '30px 30px 0px 30px',
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
												style={{
													height: '160px',
													width: '100%',
													color: '#000',
													border: '1px solid #1890ff',
													backgroundColor:
														this.state
															.visualization ===
														'none'
															? '#eaf5ff'
															: '#eaf5ff',
												}}
												className={
													this.state.visualization ===
													'none'
														? fadeOutStyles
														: ''
												}
												onClick={() => {
													this.setConfig(
														'visualization',
														'none',
													);
												}}
											>
												Built-in dashboard
											</Button>
											<p>
												Includes index management, dev
												tools, search relevancy,
												insights and access controls.
											</p>
										</div>
										<div className={esContainer}>
											<Button
												size="large"
												type={
													this.state.visualization ===
														'kibana' ||
													this.state.visualization ===
														'opensearch'
														? 'primary'
														: 'default'
												}
												style={{
													height: '160px',
													width: '100%',
													backgroundColor:
														this.state
															.visualization ===
															'kibana' ||
														this.state
															.visualization ===
															'opensearch'
															? '#eaf5ff'
															: '#fff',
												}}
												className={
													this.state.visualization ===
													'kibana'
														? fadeOutStyles
														: ''
												}
												onClick={() => {
													this.setConfig(
														'visualization',
														this.state.esFlavor ===
															'opensearch'
															? 'opensearch'
															: 'kibana',
													);
												}}
											>
												<img
													width={150}
													src={
														this.state.esFlavor ===
														'opensearch'
															? `https://opensearch.org/assets/brand/SVG/Logo/opensearch_logo_default.svg`
															: `https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt8781708f8f37ed16/5c11ec2edf09df047814db23/logo-elastic-kibana-lt.svg`
													}
													alt="visualization"
												/>
											</Button>
											<p>
												{this.state.esFlavor ===
												'opensearch'
													? 'Add OpenSearch Dashboards - A BI tool for visualizing Elasticsearch data and navigating OpenSearch'
													: 'Add Kibana - A BI tool for visualizing Elasticsearch data and navigating the Elastic stack.'}
											</p>
										</div>
									</div>
									{PLAN_LABEL[this.state.pricing_plan] ===
										'Sandbox' && (
										<div
											style={{
												margin: 30,
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<InfoCircleTwoTone
												twoToneColor="#fbe137"
												style={{
													marginRight: 5,
													fontSize: 20,
												}}
											/>
											<div>
												We don&apos;t recommend adding
												Kibana on Sandbox instances.
											</div>
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
										{activeClusters
											.filter(i => i.recipe === 'default')
											.map(item => (
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
										<ArrowRightOutlined />
									</Button>
								) : (
									<Button
										type="primary"
										size="large"
										onClick={this.createCluster}
									>
										Create Cluster
										<ArrowRightOutlined />
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

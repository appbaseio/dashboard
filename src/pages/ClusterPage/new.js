import React, { Fragment, Component } from 'react';
import {
 Modal, Button, Icon, Select,
} from 'antd';

import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import PricingSlider from './components/PricingSlider';

import { clusterContainer, card, settingsItem } from './styles';
import { deployCluster, getClusters } from './utils';
import plugins from './utils/plugins';
import { regions, regionsByPlan } from './utils/regions';

const { Option } = Select;

const SSH_KEY =	'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCVqOPpNuX53J+uIpP0KssFRZToMV2Zy/peG3wYHvWZkDvlxLFqGTikH8MQagt01Slmn+mNfHpg6dm5NiKfmMObm5LbcJ62Nk9AtHF3BPP42WyQ3QiGZCjJOX0fVsyv3w3eB+Eq+F+9aH/uajdI+wWRviYB+ljhprZbNZyockc6V33WLeY+EeRQW0Cp9xHGQUKwJa7Ch8/lRkNi9QE6n5W/T6nRuOvu2+ThhjiDFdu2suq3V4GMlEBBS6zByT9Ct5ryJgkVJh6d/pbocVWw99mYyVm9MNp2RD9w8R2qytRO8cWvTO/KvsAZPXj6nJtB9LaUtHDzxe9o4AVXxzeuMTzx siddharth@appbase.io';

const esVersions = [
	'7.1.1',
	'7.0.1',
	'6.8.0',
	'6.7.2',
	'6.6.2',
	'6.5.4',
	'6.4.3',
	'6.3.2',
	'6.2.4',
	'6.1.4',
	'6.0.1',
	'5.6.16',
	'5.5.3',
	'5.4.3',
	'5.3.3',
	'5.2.1',
];

const arcVersions = {
	7: '7.0.1-appbase',
	6: '0.1.5',
	5: 'v5-0.0.1',
};

export const machineMarks = {
	azure: {
		0: {
			label: 'Sandbox',
			plan: 'sandbox',
			storage: 30,
			memory: 4,
			nodes: 1,
			cpu: 2,
			cost: 59,
			machine: 'Standard_B2s',
			pph: 0.08,
		},
		20: {
			label: 'Hobby',
			plan: 'hobby',
			storage: 30,
			memory: 4,
			nodes: 2,
			cpu: 2,
			cost: 119,
			machine: 'Standard_B2s',
			pph: 0.17,
		},
		40: {
			label: 'Starter',
			plan: 'starter',
			storage: 40,
			memory: 4,
			nodes: 3,
			cpu: 2,
			cost: 199,
			machine: 'Standard_B2s',
			pph: 0.28,
		},
		60: {
			label: 'Production-I',
			plan: 'production-1',
			storage: 80,
			memory: 8,
			nodes: 3,
			cpu: 2,
			cost: 399,
			machine: 'Standard_B2s',
			pph: 0.55,
		},
		80: {
			label: 'Production-II',
			plan: 'production-2',
			storage: 160,
			memory: 16,
			nodes: 3,
			cpu: 4,
			cost: 799,
			machine: 'Standard_B2ms',
			pph: 1.11,
		},
		100: {
			label: 'Production-III',
			plan: 'production-3',
			storage: 333,
			memory: 32,
			nodes: 3,
			cpu: 8,
			cost: 1599,
			machine: 'Standard_B4ms',
			pph: 2.22,
		},
	},
	gke: {
		0: {
			label: 'Sandbox',
			plan: 'sandbox',
			storage: 30,
			memory: 4,
			nodes: 1,
			cpu: 2,
			cost: 59,
			machine: 'custom-2-4096',
			pph: 0.08,
		},
		20: {
			label: 'Hobby',
			plan: 'hobby',
			storage: 30,
			memory: 4,
			nodes: 2,
			cpu: 2,
			cost: 119,
			machine: 'custom-2-4096',
			pph: 0.17,
		},
		40: {
			label: 'Starter',
			plan: 'starter',
			storage: 40,
			memory: 4,
			nodes: 3,
			cpu: 2,
			cost: 199,
			machine: 'Standard_B2s',
			pph: 0.28,
		},
		60: {
			label: 'Production-I',
			plan: 'production-1',
			storage: 80,
			memory: 8,
			nodes: 3,
			cpu: 2,
			cost: 399,
			machine: 'custom-2-4096',
			pph: 0.55,
		},
		80: {
			label: 'Production-II',
			plan: 'production-2',
			storage: 160,
			memory: 16,
			nodes: 3,
			cpu: 4,
			cost: 799,
			machine: 'n1-standard-2',
			pph: 1.11,
		},
		100: {
			label: 'Production-III',
			plan: 'production-3',
			storage: 333,
			memory: 32,
			nodes: 3,
			cpu: 8,
			cost: 1599,
			machine: 'n1-standard-4',
			pph: 2.22,
		},
	},
};

const namingConvention = {
	azure: 'You may use alpha-numerics with "-" in between',
	gke: 'Name must start with an alphabet and you may use alpha-numerics with "-" in between',
};

export default class NewCluster extends Component {
	constructor(props) {
		super(props);

		const pluginState = {};
		Object.keys(plugins).forEach((item) => {
			pluginState[item] = item !== 'x-pack';
		});

		const provider = 'gke';

		this.state = {
			isLoading: false,
			clusterName: '',
			clusterVersion: esVersions[0],
			pricing_plan: machineMarks[provider][0].plan,
			vm_size: machineMarks[provider][0].machine,
			region: '',
			kibana: false,
			streams: true,
			elasticsearchHQ: true,
			arc: true,
			error: '',
			clusters: [],
			deploymentError: '',
			restore_from: null,
			showError: false,
			isClusterLoading: true,
			provider,
			...pluginState,
		};
	}

	componentDidMount() {
		getClusters()
			.then((clusters) => {
				const activeClusters = clusters.filter(
					item => item.status === 'active' && item.role === 'admin',
				);
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters: activeClusters,
					isClusterLoading: false,
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isClusterLoading: false,
				});
			});
	}

	componentDidUpdate(_, prevState) {
		const { provider } = this.state;
		if (prevState.provider !== provider) {
			const [currentMachine] = Object.entries(machineMarks[prevState.provider]).find(
				([, value]) => value.machine === prevState.vm_size,
			);
			// eslint-disable-next-line
			this.setState({
				pricing_plan: machineMarks[provider][currentMachine].plan,
				vm_size: machineMarks[provider][currentMachine].machine,
				region: '',
			});
		}
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	setPricing = (plan) => {
		this.setState({
			vm_size: plan.machine,
			pricing_plan: plan.plan,
		});
	};

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	validateClusterName = () => {
		const { clusterName, provider } = this.state;
		let pattern = /^[a-zA-Z0-9]+([-]+[a-zA-Z0-9]*)*[a-zA-Z0-9]+$/;
		if (provider === 'gke') {
			// gke cluster names can't start with a number, no capital letters allowed
			pattern = /^[a-z]+([-a-z0-9]*)*[a-z0-9]+$/;
		}
		return pattern.test(clusterName);
	};

	hideErrorModal = () => {
		this.setState({
			showError: false,
			deploymentError: '',
		});
	};

	createCluster = () => {
		if (!this.validateClusterName()) {
			// prettier-ignore
			let errorMessage = 'Please use a valid cluster name. It can only contain alpha-numerics and "-" in between.';
			if (this.state.provider === 'gke') {
				errorMessage = `${errorMessage} Capital letters not allowed.`;
			}
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

		const selectedMachine = Object.values(machineMarks[this.state.provider]).find(
			item => item.plan === this.state.pricing_plan,
		);

		const body = {
			elasticsearch: {
				nodes: selectedMachine.nodes,
				version: this.state.clusterVersion,
				volume_size: selectedMachine.storage / selectedMachine.nodes,
				plugins: Object.keys(plugins).filter(item => this.state[item]),
				restore_from: this.state.restore_from,
			},
			cluster: {
				name: this.state.clusterName,
				location: this.state.region,
				vm_size: this.state.vm_size,
				pricing_plan: this.state.pricing_plan,
				ssh_public_key: SSH_KEY,
				provider: this.state.provider,
			},
		};

		if (this.state.kibana) {
			body.kibana = {
				create_node: false,
				version: this.state.clusterVersion,
			};
		}

		if (this.state.streams) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'streams',
					image: 'appbaseio/streams:6',
					exposed_port: 80,
				},
			];
		}

		if (this.state.elasticsearchHQ) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.5.0',
					exposed_port: 5000,
				},
			];
		}

		if (this.state.arc) {
			const arcTag = arcVersions[this.state.clusterVersion.split('.')[0]] || arcVersions['6'];
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'arc',
					image: `siddharthlatest/arc:${arcTag}`,
					exposed_port: 8000,
				},
			];
		}

		this.setState({
			isLoading: true,
		});

		deployCluster(body)
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

	renderPlugins = () => (
		<div className={card}>
			<div className="col light">
				<h3>Edit Cluster Plugins</h3>
				<p>Add or remove cluster plugins</p>
			</div>
			<div className="col grow">
				{Object.keys(plugins).map(plugin => (
					<div key={plugin} className={`${settingsItem} grow`}>
						<h4>{plugins[plugin]}</h4>
						<div>
							<label htmlFor={`${plugin}-yes`}>
								<input
									type="radio"
									name={plugin}
									defaultChecked={this.state[plugin]}
									id={`${plugin}-yes`}
									onChange={() => this.setConfig(plugin, true)}
								/>
								Yes
							</label>

							<label htmlFor={`${plugin}-no`}>
								<input
									type="radio"
									name={plugin}
									defaultChecked={!this.state[plugin]}
									id={`${plugin}-no`}
									onChange={() => this.setConfig(plugin, false)}
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
		const regionsList1 = {};
		const regionsList2 = {};
		const { provider, pricing_plan: pricingPlan } = this.state;
		const allowedRegions = regionsByPlan[provider][pricingPlan];

		Object.keys(regions[provider]).forEach((region, i) => {
			if (i % 2 === 0) {
				regionsList1[region] = regions[provider][region];
			} else {
				regionsList2[region] = regions[provider][region];
			}
		});

		return (
			<React.Fragment>
				<ul className="region-list">
					{Object.keys(regionsList1).map((region) => {
						const regionValue = regionsList1[region];
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
					})}
				</ul>
				<ul className="region-list">
					{Object.keys(regionsList2).map((region) => {
						const regionValue = regionsList2[region];
						const isDisabled = allowedRegions
							? !allowedRegions.includes(region)
							: false;
						return (
							// eslint-disable-next-line
							<li
								disabled
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
					})}
				</ul>
			</React.Fragment>
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

	handleCluster = (value) => {
		this.setState({
			restore_from: value,
		});
	};

	render() {
		const { provider, isLoading } = this.state;

		const isInvalid = !this.validateClusterName();
		if (isLoading) return <Loader />;

		return (
			<Fragment>
				<FullHeader isCluster />
				<Container>
					<section className={clusterContainer}>
						{this.state.showError ? this.handleError() : null}
						<article>
							<h2>Create a new cluster</h2>

							<div className={card}>
								<div className="col light">
									<h3>Pick the pricing plan</h3>
									<p>Scale as you go</p>
								</div>

								<PricingSlider
									key={this.state.provider}
									marks={machineMarks[this.state.provider]}
									onChange={this.setPricing}
								/>
							</div>

							<div className={card}>
								<div className="col light">
									<h3>Pick the provider</h3>
								</div>

								<div
									className={settingsItem}
									css={{
										padding: 30,
									}}
								>
									<Button
										type={this.state.provider === 'gke' ? 'primary' : 'default'}
										size="large"
										css={{
											height: 160,
											marginRight: 20,
											backgroundColor:
												this.state.provider === 'gke' ? '#eaf5ff' : '#fff',
										}}
										onClick={() => this.setConfig('provider', 'gke')}
									>
										<img
											width="120"
											src="/static/images/clusters/google.png"
											alt="Google"
										/>
									</Button>

									<Button
										size="large"
										css={{
											height: 160,
											backgroundColor:
												this.state.provider === 'azure'
													? '#eaf5ff'
													: '#fff',
										}}
										onClick={() => this.setConfig('provider', 'azure')}
									>
										<img
											width="120"
											src="/static/images/clusters/azure.png"
											alt="Azure"
										/>
									</Button>
								</div>
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
									<h3>Pick a cluster name</h3>
									<p>Name this bad boy</p>
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
												isInvalid && this.state.clusterName !== ''
													? '1px solid red'
													: '1px solid #e8e8e8',
										}}
										placeholder="Enter your cluster name"
										value={this.state.clusterName}
										onChange={e => this.setConfig('clusterName', e.target.value)
										}
									/>
									<p
										style={{
											color:
												isInvalid && this.state.clusterName !== ''
													? 'red'
													: 'inherit',
										}}
									>
										{provider === 'azure'
											? namingConvention.azure
											: namingConvention.gke}
									</p>
								</div>
							</div>

							<div className={card}>
								<div className="col light">
									<h3>Additional Settings</h3>
									<p>Customise as per your needs</p>
								</div>
								<div className="col grow">
									<div className={settingsItem}>
										<h4>Select a version</h4>
										<select
											className="form-control"
											onChange={e => this.setConfig('clusterVersion', e.target.value)
											}
										>
											{esVersions.map(version => (
												<option
													key={version}
													value={version}
													defaultChecked={
														this.state.clusterVersion === version
													}
												>
													{version}
												</option>
											))}
										</select>
									</div>

									<div className={settingsItem}>
										<h4>Kibana</h4>
										<div>
											<label htmlFor="yes">
												<input
													type="radio"
													name="kibana"
													defaultChecked={this.state.kibana}
													id="yes"
													onChange={() => this.setConfig('kibana', true)}
												/>
												Yes
											</label>

											<label htmlFor="no">
												<input
													type="radio"
													name="kibana"
													defaultChecked={!this.state.kibana}
													id="no"
													onChange={() => this.setConfig('kibana', false)}
												/>
												No
											</label>
										</div>
									</div>
									<div className={settingsItem}>
										<h4>Add-ons</h4>
										<div>
											<label htmlFor="arc-middleware">
												<input
													type="checkbox"
													defaultChecked={this.state.arc}
													id="arc-middleware"
													onChange={() => this.toggleConfig('arc')}
												/>
												Appbase.io GUI
											</label>

											<label htmlFor="streams">
												<input
													type="checkbox"
													defaultChecked={this.state.streams}
													id="streams"
													onChange={() => this.toggleConfig('streams')}
												/>
												Realtime Streaming
											</label>

											<label htmlFor="elasticsearch">
												<input
													type="checkbox"
													defaultChecked={this.state.elasticsearchHQ}
													id="elasticsearch"
													onChange={() => this.toggleConfig('elasticsearchHQ')
													}
												/>
												Elasticsearch-HQ
											</label>
										</div>
									</div>
								</div>
							</div>

							{this.renderPlugins()}

							<div className={card}>
								<div className="col light">
									<h3>Restore a cluster data</h3>
									<p>
										Select the cluster from which you want to restore the latest
										snapshot from.
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
											<Option key={item.id}>{item.name}</Option>
										))}
									</Select>
								</div>
							</div>

							<div style={{ textAlign: 'right', marginBottom: 40 }}>
								{this.state.error ? (
									<p style={{ color: 'tomato', margin: '20px 0' }}>
										{this.state.error}
									</p>
								) : null}
								<Button type="primary" size="large" onClick={this.createCluster}>
									Create Cluster
									<Icon type="arrow-right" theme="outlined" />
								</Button>
							</div>
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}

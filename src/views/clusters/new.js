import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import PricingSlider from './components/PricingSlider';
import { deployCluster } from './utils';

const SSH_KEY = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCVqOPpNuX53J+uIpP0KssFRZToMV2Zy/peG3wYHvWZkDvlxLFqGTikH8MQagt01Slmn+mNfHpg6dm5NiKfmMObm5LbcJ62Nk9AtHF3BPP42WyQ3QiGZCjJOX0fVsyv3w3eB+Eq+F+9aH/uajdI+wWRviYB+ljhprZbNZyockc6V33WLeY+EeRQW0Cp9xHGQUKwJa7Ch8/lRkNi9QE6n5W/T6nRuOvu2+ThhjiDFdu2suq3V4GMlEBBS6zByT9Ct5ryJgkVJh6d/pbocVWw99mYyVm9MNp2RD9w8R2qytRO8cWvTO/KvsAZPXj6nJtB9LaUtHDzxe9o4AVXxzeuMTzx siddharth@appbase.io';

const esVersions = [
	'6.3.0',
	'6.2.4',
	'6.1.4',
	'6.0.1',
	'5.6.10',
	'5.5.3',
	'5.4.3',
	'5.3.3',
	'5.2.1',
];

const machineMarks = {
	0: {
		label: 'Sandbox',
		storage: 30,
		memory: 1,
		nodes: 1,
		cost: 49,
		machine: 'Basic_A1',
	},
	25: {
		label: 'Hobby',
		storage: 60,
		memory: 2,
		nodes: 2,
		cost: 99,
		machine: 'Standard_A1_v2',
	},
	50: {
		label: 'Production I',
		storage: 120,
		memory: 4,
		nodes: 3,
		cost: 199,
		machine: 'Standard_B2s',
	},
	75: {
		label: 'Production II',
		storage: 240,
		memory: 8,
		nodes: 3,
		cost: 299,
		machine: 'Standard_B2ms',
	},
	100: {
		label: 'Production III',
		storage: 512,
		memory: 16,
		nodes: 3,
		cost: 499,
		machine: 'Standard_B4ms',
	},
};

export default class NewCluster extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clusterName: '',
			clusterVersion: esVersions[0],
			vm_size: machineMarks[0].machine,
			region: 'eastus',
			kibana: false,
			logstash: false,
			dejavu: true,
			elasticsearchHQ: true,
			mirage: false,
		};
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	}

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	}

	createCluster = () => {
		const selectedMachine = Object.values(machineMarks)
			.find(item => item.machine === this.state.vm_size);

		const body = {
			elasticsearch: {
				nodes: selectedMachine.nodes,
				version: this.state.clusterVersion,
				volume_size: selectedMachine.storage,
				plugins: [], // TODO
			},
			cluster: {
				name: this.state.clusterName,
				location: this.state.region,
				vm_size: this.state.vm_size,
				ssh_public_key: SSH_KEY,
			},
		};

		if (this.state.kibana) {
			body.kibana = {
				create_node: false,
				version: this.state.clusterVersion,
			};
		}

		if (this.state.logstash) {
			body.logstash = {
				create_node: false,
				version: this.state.clusterVersion,
			};
		}

		if (this.state.dejavu) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'dejavu',
					image: 'appbaseio/dejavu:1.5.0',
					exposed_port: 1358,
				},
			];
		}

		if (this.state.mirage) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'mirage',
					image: 'appbaseio/mirage:0.8.0',
					exposed_port: 3030,
				},
			];
		}

		if (this.state.elasticsearchHQ) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.4.0',
					exposed_port: 5000,
				},
			];
		}

		deployCluster(body)
			.then(() => {
				browserHistory.push('/clusters');
			})
			.catch((e) => {
				// TODO: handle errror
				console.log('error', e);
			});
	}

	render() {
		return (
			<section className="cluster-container container">
				<article>
					<h2>Create a new cluster</h2>
					<div className="card">
						<div className="col light">
							<h3>Pick the pricing plan</h3>
							<p>Scale as you go</p>
						</div>

						<PricingSlider
							marks={machineMarks}
							onChange={selected => this.setConfig('vm_size', selected.machine)}
						/>
					</div>

					<div className="card">
						<div className="col light">
							<h3>Pick a region</h3>
							<p>All around the globe</p>
						</div>
						<div className="col grow region-container">
							<ul className="region-list">
								<li
									onClick={() => this.setConfig('region', 'eastus')}
									className={this.state.region === 'eastus' ? 'active' : ''}
								>
									<img src="/assets/images/flags/united-states.png" alt="US" />
									<span>East US</span>
								</li>
								<li
									onClick={() => this.setConfig('region', 'centralus')}
									className={this.state.region === 'centralus' ? 'active' : ''}
								>
									<img src="/assets/images/flags/united-states.png" alt="US" />
									<span>Central US</span>
								</li>
								<li
									onClick={() => this.setConfig('region', 'westeurope')}
									className={this.state.region === 'westeurope' ? 'active' : ''}
								>
									<img src="/assets/images/flags/europe.png" alt="EU" />
									<span>West Europe</span>
								</li>
							</ul>
							<ul className="region-list">
								<li
									onClick={() => this.setConfig('region', 'canandacentral')}
									className={this.state.region === 'canandacentral' ? 'active' : ''}
								>
									<img src="/assets/images/flags/canada.png" alt="CA" />
									<span>Canada Central</span>
								</li>
								<li
									onClick={() => this.setConfig('region', 'canandaeast')}
									className={this.state.region === 'canandaeast' ? 'active' : ''}
								>
									<img src="/assets/images/flags/canada.png" alt="CA" />
									<span>Canada East</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="card">
						<div className="col light">
							<h3>Pick a cluster name</h3>
							<p>Name this bad boy</p>
						</div>
						<div className="col grow vcenter">
							<input
								type="name"
								className="form-control"
								placeholder="Enter your cluster name"
								value={this.state.clusterName}
								onChange={e => this.setConfig('clusterName', e.target.value)}
							/>
						</div>
					</div>

					<div className="card">
						<div className="col light">
							<h3>Additional Settings</h3>
							<p>Customise as per your needs</p>
						</div>
						<div className="col grow">
							<div className="settings-item">
								<h4>Select a version</h4>
								<select
									className="form-control"
									onChange={e => this.setConfig('clusterVersion', e.target.value)}
								>
									{
										esVersions.map(version => (
											<option
												key={version}
												value={version}
												defaultChecked={this.state.clusterVersion === version}
											>
												{version}
											</option>
										))
									}
								</select>
							</div>

							<div className="settings-item">
								<h4>Kibana</h4>
								<div className="form-check">
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

							<div className="settings-item">
								<h4>Logstash</h4>
								<div className="form-check">
									<label htmlFor="yes2">
										<input
											type="radio"
											name="logstash"
											defaultChecked={this.state.logstash}
											id="yes2"
											onChange={() => this.setConfig('logstash', true)}
										/>
										Yes
									</label>

									<label htmlFor="no2">
										<input
											type="radio"
											name="logstash"
											defaultChecked={!this.state.logstash}
											id="no2"
											onChange={() => this.setConfig('logstash', false)}
										/>
										No
									</label>
								</div>
							</div>

							<div className="settings-item">
								<h4>Add-ons</h4>
								<div className="form-check">
									<label htmlFor="dejavu">
										<input
											type="checkbox"
											defaultChecked={this.state.dejavu}
											id="dejavu"
											onChange={() => this.toggleConfig('dejavu')}
										/>
										Dejavu
									</label>

									<label htmlFor="elasticsearch">
										<input
											type="checkbox"
											defaultChecked={this.state.elasticsearchHQ}
											id="elasticsearch"
											onChange={() => this.toggleConfig('elasticsearchHQ')}
										/>
										Elasticsearch-HQ
									</label>

									<label htmlFor="mirage">
										<input
											type="checkbox"
											defaultChecked={this.state.mirage}
											id="mirage"
											onChange={() => this.toggleConfig('mirage')}
										/>
										Mirage
									</label>
								</div>
							</div>
						</div>
					</div>

					<div style={{ textAlign: 'right', marginBottom: 40 }}>
						<button className="ad-theme-btn primary" onClick={this.createCluster}>
							Create Cluster &nbsp; &nbsp;
							<i className="fas fa-arrow-right" />
						</button>
					</div>
				</article>
			</section>
		);
	}
}

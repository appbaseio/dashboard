import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { getClusterData, deployCluster } from './utils';
import { regions } from './index';
import { machineMarks } from './new';

import CopyToClipboard from '../../shared/CopyToClipboard';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: null,
			deployment: null,
			kibana: false,
			logstash: false,
			elasticsearch: false,
			mirage: false,
		};
	}

	componentDidMount() {
		this.init();
	}

	getFromPricing = (plan, key) => {
		const selectedPlan = Object.values(machineMarks)
			.find(item => item.label === plan);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	}

	init = () => {
		getClusterData(this.props.routeParams.id)
			.then((res) => {
				this.originalCluster = res;
				const { cluster, deployment } = res;
				this.setState({
					cluster,
					deployment,
					kibana: deployment.kibana
						? !!Object.keys(deployment.kibana).length
						: false,
					logstash: deployment.logstash
						? !!Object.keys(deployment.logstash).length
						: false,
					elasticsearch: deployment.elasticsearch
						? !!Object.keys(deployment.elasticsearch).length
						: false,
					mirage: deployment.mirage
						? !!Object.keys(deployment.mirage).length
						: false,
				});

				if (cluster.status === 'in progress') {
					setTimeout(this.init, 30000);
				}
			});
	}

	copySuccess = (source) => {
		// eslint-disable-next-line
		toastr.success(`${source} credentials have been copied successully!`);
	}

	copyError = () => {
		// eslint-disable-next-line
		toastr.error('Error', e);
	}

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	}

	includedInOriginal = (key) => {
		const original = this.originalCluster.deployment;
		return original[key] ? !!Object.keys(original[key]).length : false;
	}

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
					image: 'appbaseio/dejavu:1.5.0',
					exposed_port: 1358,
				},
			];
		} else if (!this.state.dejavu && this.includedInOriginal('dejavu')) {
			body.remove_deployments = [...body.remove_deployments, 'dejavu'];
		}

		if (this.state.mirage && !this.includedInOriginal('mirage')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'mirage',
					image: 'appbaseio/mirage:0.8.0',
					exposed_port: 3030,
				},
			];
		} else if (!this.state.mirage && this.includedInOriginal('mirage')) {
			body.remove_deployments = [...body.remove_deployments, 'mirage'];
		}

		if (this.state.elasticsearch && !this.includedInOriginal('elasticsearch')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.4.0',
					exposed_port: 5000,
				},
			];
		} else if (!this.state.elasticsearch && this.includedInOriginal('elasticsearch')) {
			body.remove_deployments = [...body.remove_deployments, 'elasticsearch'];
		}

		deployCluster(body, this.props.routeParams.id)
			.then(() => {
				browserHistory.push('/clusters');
			})
			.catch((e) => {
				// TODO: handle errror
				console.log('error', e);
			});
	}

	renderClusterRegion = (region) => {
		if (!region) return null;

		const { name, flag } = regions[region];
		return (
			<div className="region-info">
				<img src={`/assets/images/flags/${flag}`} alt="US" />
				<span>{name}</span>
			</div>
		);
	}

	renderClusterEndpoint = (source) => {
		if (Object.keys(source).length) {
			return (
				<div key={source.name} className="cluster-endpoint">
					<h4>
						<a href={source.url} target="_blank" rel="noopener noreferrer">
							<i className="fas fa-external-link-alt" />
							{source.name}
						</a>
					</h4>
					<div className="creds-box">
						<span>
							####################################
						</span>
						<span>
							<a>
								<i className="fas fa-eye" />
							</a>
							<CopyToClipboard
								type="danger"
								onSuccess={() => this.copySuccess(source.name)}
								onError={() => this.copyError(source.name)}
							>
								<a data-clipboard-text={`${source.username}:${source.password}`}>
									<i className="far fa-clone" />
								</a>
							</CopyToClipboard>
						</span>
					</div>
				</div>
			);
		}

		return null;
	}

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

		if (!this.state.cluster) {
			return (
				<div style={vcenter}>
					Loading cluster data...
				</div>
			);
		}

		return (
			<section className="cluster-container container">
				<article>
					<h2>{this.state.cluster.name} <span className="tag">{this.state.cluster.status}</span></h2>

					<ul className="clusters-list">
						<li key={this.state.cluster.name} className="cluster-card compact">

							<div className="info-row">
								<div>
									<h4>Region</h4>
									{this.renderClusterRegion(this.state.cluster.region)}
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
										{
											this.getFromPricing(
												this.state.cluster.pricing_plan,
												'memory',
											)
										} GB
									</div>
								</div>

								<div>
									<h4>Disk Size</h4>
									<div>
										{
											this.getFromPricing(
												this.state.cluster.pricing_plan,
												'storage',
											)
										} GB
									</div>
								</div>

								<div>
									<h4>Nodes</h4>
									<div>{this.state.cluster.total_nodes}</div>
								</div>
							</div>
						</li>

						{
							this.state.cluster.status === 'in progress'
								? null
								: (
									<li className="card">
										<div className="col light">
											<h3>Endpoints</h3>
											<p>Plug-ins and Add-ons</p>
										</div>

										<div className="col">
											{
												Object.keys(this.state.deployment)
													.filter(item => item !== 'addons')
													.map(key => this.renderClusterEndpoint(this.state.deployment[key]))
											}
										</div>
									</li>
								)
						}

						{
							this.state.cluster.status === 'in progress'
								? null
								: (
									<li className="card">
										<div className="col light">
											<h3>Edit Cluster Settings</h3>
											<p>Customise as per your needs</p>
										</div>
										<div className="col grow">
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
															defaultChecked={this.state.elasticsearch}
															id="elasticsearch"
															onChange={() => this.toggleConfig('elasticsearch')}
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
									</li>
								)
						}
					</ul>

					{
						this.state.cluster.status === 'in progress'
							? <p style={{ textAlign: 'center' }}>Deployment is in progress. Please wait.</p>
							: (
								<div style={{ textAlign: 'right', marginBottom: 40 }}>
									<button className="ad-theme-btn primary" onClick={this.saveClusterSettings}>
										Save Cluster Settings &nbsp; &nbsp;
										<i className="fas fa-arrow-right" />
									</button>
								</div>
							)
					}
				</article>
			</section>
		);
	}
}

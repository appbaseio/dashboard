import React, { Component } from 'react';
import { getClusterData } from './utils';
import { regions } from './index';
import { machineMarks } from './new';

import CopyToClipboard from '../../shared/CopyToClipboard';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: null,
			deployment: null,
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

	init = () => {
		getClusterData(this.props.routeParams.id)
			.then((res) => {
				const { cluster, deployment } = res;
				this.setState({
					cluster,
					deployment,
				});

				if (cluster.status === 'In progress') {
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
				<div className="cluster-endpoint">
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
										}
									</div>
								</div>

								<div>
									<h4>Disk Size</h4>
									<div>
										{
											this.getFromPricing(
												this.state.cluster.pricing_plan,
												'disk',
											)
										}
									</div>
								</div>

								<div>
									<h4>Nodes</h4>
									<div>{this.state.cluster.total_nodes}</div>
								</div>
							</div>
						</li>

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

						{/* <li className="card">
							<div className="col light">
								<h3>Active pricing plan</h3>
								<p>Production II</p>
							</div>

							<div className="col grey" style={{ width: 350 }}>
								<div className="cluster-info">
									<div className="cluster-info__item">
										<div>
											10 GB
										</div>
										<div>Storage (SSD)</div>
									</div>
									<div className="cluster-info__item">
										<div>
											120 GB
										</div>
										<div>Memory</div>
									</div>
									<div className="cluster-info__item">
										<div>
											3 Nodes
										</div>
										<div>HA</div>
									</div>
								</div>
								<div className="cluster-info">
									<div>
										<div className="price">
											<span>$</span>
											299 /mo
										</div>
										<h3>Estimated Cost</h3>
									</div>
								</div>
							</div>

							<div className="col grow">
								<h3>Usage this month</h3>
								<p style={{ fontSize: 13, fontWeight: 600, color: '#999' }}>Billing period: June 1 - June 30, 2018</p>

								<br />

								<div className="cluster-info">
									<div>
										<div className="price">
											<span>$</span>
											56.50
										</div>
										<h3>Payment Due</h3>
									</div>
								</div>

								<br />
								<div style={{ textAlign: 'right' }}>
									<button className="ad-theme-btn primary">Pay Now</button>
									<button className="ad-theme-btn">View Details</button>
								</div>
							</div>
						</li>

						<li className="card">
							<div className="col light">
								<h3>Invoices</h3>
								<p>For book-keeping</p>
							</div>

							<table className="invoice-table">
								<tbody>
									<tr>
										<th>Invoice-number</th>
										<th>Month</th>
										<th>Status</th>
										<th />
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
								</tbody>
							</table>
						</li> */}
					</ul>

				</article>
			</section>
		);
	}
}
